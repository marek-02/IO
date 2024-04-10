import pandas as pd
import numpy as np
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from scipy.stats import chi2_contingency, ttest_ind, f_oneway
from statsmodels.stats.weightstats import ztest
import csv

df = None

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

@csrf_exempt
def detect_data_types(request):
    global df
    if request.method == 'POST' and request.FILES['csv_file']:
        csv_file = request.FILES['csv_file']

        df = pd.read_csv(csv_file, sep=';', decimal=',')

        object_columns = df.select_dtypes(include=['object']).columns
        for column in object_columns:
            try:
                df[column] = pd.to_datetime(df[column], errors='raise')
            except ValueError:
                pass

        df = df.convert_dtypes()
        
        data_types = df.dtypes
        
        print(data_types)

        data_types_dict = data_types.apply(lambda x: x.name).to_dict()
        
        data_records = df.to_dict(orient='records')

        print(data_types_dict)
        
        for key in data_types_dict:
            if "ID" in key:
                data_types_dict[key] = 'Object'
        
        response_data = {
            'data_types': data_types_dict,
            'data_records': data_records
        }

        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Proszę przesłać plik CSV.'}, status=400)

@csrf_exempt
def change_variable_name(request):
    global df
    if request.method == 'POST' and 'old_name' in request.POST and 'new_name' in request.POST:
        old_name = request.POST['old_name']
        new_name = request.POST['new_name']

        if old_name and new_name:
            if old_name in df.columns:
                df.rename(columns={old_name: new_name}, inplace=True)
                data_types = df.dtypes
                data_types_dict = data_types.apply(lambda x: x.name).to_dict()
                data_records = df.to_dict(orient='records')
                return JsonResponse({'success': True, 'data_types': data_types_dict, 'data_records': data_records})
            else:
                return JsonResponse({'success': False, 'error': f'Zmienna o nazwie "{old_name}" nie istnieje w pliku CSV.'})
        else:
            return JsonResponse({'success': False, 'error': 'Proszę przesłać zarówno starą, jak i nową nazwę zmiennej.'})
    else:
        return JsonResponse({'success': False, 'error': 'Proszę przesłać starą i nową nazwę zmiennej w zapytaniu POST.'})

@csrf_exempt
def change_variable_type(request):
    global df
    if request.method == 'POST' and 'column_name' in request.POST and 'new_type' in request.POST:
        column_name = request.POST['column_name']
        new_type = request.POST['new_type']

        if column_name and new_type:
            if column_name in df.columns:
                try:
                    df[column_name] = df[column_name].astype(new_type)
                    data_types = df.dtypes

                    data_types_dict = data_types.apply(lambda x: x.name).to_dict()
                    # print(data_types_dict)
                except ValueError:
                    return JsonResponse({'success': False, 'error': f'Nie można przekonwertować kolumny "{column_name}" na typ "{new_type}". Sprawdź, czy wszystkie wartości są zgodne z nowym typem danych.'})
                data_types = df.dtypes
                data_types_dict = data_types.apply(lambda x: x.name).to_dict()
                data_records = df.to_dict(orient='records')
                return JsonResponse({'success': True, 'data_types': data_types_dict, 'data_records': data_records})
            else:
                return JsonResponse({'success': False, 'error': f'Kolumna "{column_name}" nie istnieje w pliku CSV.'})
        else:
            return JsonResponse({'success': False, 'error': 'Proszę przesłać nazwę kolumny i nowy typ danych w zapytaniu POST.'})
    else:
        return JsonResponse({'success': False, 'error': 'Proszę przesłać nazwę kolumny i nowy typ danych w zapytaniu POST.'})

@csrf_exempt
def generate_statistics_1d(request):
    global df
    if request.method == 'GET':
        statistics = {}

        for column in df.columns:
            column_data = df[column]
            if column_data.dtype in ["<M8[ns]", "datetime64[ns]"]:
                continue
            elif df[column].dtype in ["Int64", "Float64"]:
                q1 = column_data.quantile(0.25)
                q3 = column_data.quantile(0.75)
                iqr = q3 - q1
                outliers_count = ((column_data < (q1 - 1.5 * iqr)) | (column_data > (q3 + 1.5 * iqr))).sum()

                stats = {
                    'min': column_data.min(),
                    'max': column_data.max(),
                    'mean': column_data.mean(),
                    'median': column_data.median(),
                    'mode': column_data.mode().values[0],
                    'range': column_data.max() - column_data.min(),
                    'quantiles': column_data.quantile([0.25, 0.5, 0.75]).to_dict(),
                    'variance': column_data.var(),
                    'standard_deviation': column_data.std(),
                    'coefficient_of_variation': column_data.std() / column_data.mean(),
                    'skewness': column_data.skew(),
                    'kurtosis': column_data.kurtosis(),
                    'outliers_count': outliers_count
                }
            else:
                stats = {
                    'count_percentage': column_data.value_counts(normalize=True).to_dict(),
                    'sum': column_data.value_counts().to_dict()
                }

            data_count = len(df)
            missing_data_count = df[column].isnull().sum()
            missing_data_percentage = (missing_data_count / len(df)) * 100

            stats['count'] = data_count
            stats['missing_data_count'] = missing_data_count
            stats['missing_data_percentage'] = missing_data_percentage
            
            statistics[column] = stats

        statistics = json.dumps(statistics, cls=NpEncoder)
        return JsonResponse(statistics, safe=False)
    else:
        return JsonResponse({'error': 'Proszę przesłać plik CSV.'}, status=400)

@csrf_exempt
def delete_data(request):
    global df
    if request.method == 'POST' and 'axis' in request.POST and 'index' in request.POST:
        axis = request.POST['axis']
        if axis not in ['rows', 'columns']:
            return JsonResponse({'error': 'Podano nieprawidłową wartość dla osi (axis). Wartością musi być "rows" lub "columns".'}, status=400)

        if axis == 'rows':
            try:
                index = int(request.POST['index'])
                df.drop(index=index, inplace=True)
            except ValueError:
                return JsonResponse({'error': 'Podano nieprawidłowy indeks dla wiersza.'}, status=400)
        elif axis == 'columns':
            column_name = request.POST['index']
            if column_name in df.columns:
                df.drop(columns=column_name, inplace=True)
            else:
                return JsonResponse({'error': 'Podana kolumna nie istnieje w ramce danych.'}, status=400)
        data_types = df.dtypes
        data_types_dict = data_types.apply(lambda x: x.name).to_dict()
        data_records = df.to_dict(orient='records')
        return JsonResponse({'success': True, 'data_types': data_types_dict, 'data_records': data_records})
    else:
        return JsonResponse({'error': 'Proszę przesłać plik CSV oraz określić, czy chcesz usunąć wiersz (ustawienie "rows") lub kolumnę (ustawienie "columns") oraz podać indeks wiersza lub nazwę kolumny, który chcesz usunąć.'}, status=400)

@csrf_exempt
def fill_missing_data(request):
    global df
    if request.method == 'POST' and 'column' in request.POST and 'statistic' in request.POST:
        column_name = request.POST['column']
        statistic = request.POST['statistic']

        if column_name not in df.columns:
            return JsonResponse({'error': f'Kolumna "{column_name}" nie istnieje w ramce danych.'}, status=400)

        if df[column_name].isnull().any():
            if df[column_name].dtype in ["Int64", "Float64"]:
                if statistic == 'min':
                    df[column_name].fillna(df[column_name].min(), inplace=True)
                elif statistic == 'max':
                    df[column_name].fillna(df[column_name].max(), inplace=True)
                elif statistic == 'mean':
                    df[column_name].fillna(df[column_name].mean(), inplace=True)
                elif statistic == 'median':
                    df[column_name].fillna(df[column_name].median(), inplace=True)
                elif statistic == 'mode':
                    df[column_name].fillna(df[column_name].mode().values[0], inplace=True)
                elif statistic == 'range':
                    df[column_name].fillna(df[column_name].max() - df[column_name].min(), inplace=True)
                elif statistic == 'variance':
                    df[column_name].fillna(df[column_name].var(), inplace=True)
                elif statistic == 'standard_deviation':
                    df[column_name].fillna(df[column_name].std(), inplace=True)
                elif statistic == 'coefficient_of_variation':
                    df[column_name].fillna(df[column_name].std() / df[column_name].mean(), inplace=True)
                elif statistic == 'skewness':
                    df[column_name].fillna(df[column_name].skew(), inplace=True)
                elif statistic == 'kurtosis':
                    df[column_name].fillna(df[column_name].kurtosis(), inplace=True)
                else:
                    return JsonResponse({'error': f'Nieprawidłowa statystyka "{statistic}" dla kolumny numerycznej "{column_name}". Wybierz jedną z: "min", "max", "mean", "median", "mode", "range", "variance", "standard_deviation", "coefficient_of_variation", "skewness", "kurtosis".'}, status=400)
            else:
                if statistic == 'mode':
                    df[column_name].fillna(df[column_name].mode().values[0], inplace=True)
                else:
                    return JsonResponse({'error': f'Nieprawidłowa statystyka "{statistic}" dla kolumny kategorycznej "{column_name}". Wybierz jedną z: "mode".'}, status=400)
            data_types = df.dtypes
            data_types_dict = data_types.apply(lambda x: x.name).to_dict()
            data_records = df.to_dict(orient='records')
            return JsonResponse({'success': True, 'data_types': data_types_dict, 'data_records': data_records})
        else:
            return JsonResponse({'error': f'Kolumna "{column_name}" nie zawiera brakujących danych.'}, status=400)
    else:
        return JsonResponse({'error': 'Proszę przesłać plik CSV, nazwę kolumny oraz statystykę do uzupełnienia brakujących danych w zapytaniu POST.'}, status=400)
    

@csrf_exempt
def fill_outliers(request):
    global df
    if request.method == 'POST' and 'column' in request.POST and 'statistic' in request.POST:
        column_name = request.POST['column']
        statistic = request.POST['statistic']

        if column_name not in df.columns:
            return JsonResponse({'error': f'Kolumna "{column_name}" nie istnieje w ramce danych.'}, status=400)

        if df[column_name].dtype in ["Int64", "Float64"]:
            q1 = df[column_name].quantile(0.25)
            q3 = df[column_name].quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr

            outliers_mask = (df[column_name] < lower_bound) | (df[column_name] > upper_bound)

            if outliers_mask.any():
                if statistic == 'min':
                    replacement_value = df[column_name].min()
                elif statistic == 'max':
                    replacement_value = df[column_name].max()
                elif statistic == 'mean':
                    replacement_value = df[column_name].mean()
                elif statistic == 'median':
                    replacement_value = df[column_name].median()
                elif statistic == 'mode':
                    replacement_value = df[column_name].mode().values[0]
                elif statistic == 'range':
                    replacement_value = df[column_name].max() - df[column_name].min()
                elif statistic == 'variance':
                    replacement_value = df[column_name].var()
                elif statistic == 'standard_deviation':
                    replacement_value = df[column_name].std()
                elif statistic == 'coefficient_of_variation':
                    replacement_value = df[column_name].std() / df[column_name].mean()
                elif statistic == 'skewness':
                    replacement_value = df[column_name].skew()
                elif statistic == 'kurtosis':
                    replacement_value = df[column_name].kurtosis()
                else:
                    return JsonResponse({'error': f'Nieprawidłowa statystyka "{statistic}" dla kolumny numerycznej "{column_name}". Wybierz jedną z: "min", "max", "mean", "median", "mode", "range", "variance", "standard_deviation", "coefficient_of_variation", "skewness", "kurtosis".'}, status=400)

                df.loc[outliers_mask, column_name] = replacement_value

                data_types = df.dtypes
                data_types_dict = data_types.apply(lambda x: x.name).to_dict()
                data_records = df.to_dict(orient='records')

                return JsonResponse({'success': True, 'data_types': data_types_dict, 'data_records': data_records})
            else:
                return JsonResponse({'error': f'Kolumna "{column_name}" nie zawiera wartości odstających.'}, status=400)
        else:
            return JsonResponse({'error': f'Kolumna "{column_name}" nie jest numeryczna.'}, status=400)
    else:
        return JsonResponse({'error': 'Proszę przesłać nazwę kolumny oraz statystykę do uzupełnienia wartości odstających w zapytaniu POST.'}, status=400)
    

@csrf_exempt
def generate_statistics_2d(request):
    global df
    if request.method == 'GET':
        statistics = {}

        for i, col1 in enumerate(df.columns):
            for j, col2 in enumerate(df.columns):
                if i >= j:
                    continue  

                data1 = df[col1]
                data2 = df[col2]

                if data1.dtype in ["<M8[ns]", "datetime64[ns]"] or data2.dtype in ["<M8[ns]", "datetime64[ns]"]:
                    continue
                
                is_numeric1 = df[col1].dtype in ["Int64", "Float64"]
                is_numeric2 = df[col2].dtype in ["Int64", "Float64"]
                is_categorical1 = not is_numeric1
                is_categorical2 = not is_numeric2

                if is_numeric1 and is_numeric2:
                    correlation = data1.corr(data2)
                    statistics[f'{col1} - {col2}'] = {'correlation': correlation}
                elif is_categorical1 and is_categorical2:
                    contingency_table = pd.crosstab(data1, data2)
                    chi2_stat, p_value, _, _ = chi2_contingency(contingency_table)
                    statistics[f'{col1} - {col2}'] = {'chi2_stat': chi2_stat, 'p_value': p_value}
                else:
                    if is_categorical1 and is_numeric2:
                        z_stat, p_value_z = ztest(data2, x2=data1)
                        statistics[f'{col1} - {col2}'] = {'z_stat': z_stat, 'p_value_z': p_value_z}

                        t_stat, p_value_t = ttest_ind(data1, data2)
                        statistics[f'{col1} - {col2}']['t_stat'] = t_stat
                        statistics[f'{col1} - {col2}']['p_value_t'] = p_value_t

                        #ANOVA
                        f_stat, p_value_anova = f_oneway(data1, data2)
                        statistics[f'{col1} - {col2}']['f_stat'] = f_stat
                        statistics[f'{col1} - {col2}']['p_value_anova'] = p_value_anova

                    elif is_numeric1 and is_categorical2:
                        z_stat, p_value_z = ztest(data1, x2=data2)
                        statistics[f'{col1} - {col2}'] = {'z_stat': z_stat, 'p_value_z': p_value_z}

                        t_stat, p_value_t = ttest_ind(data1, data2)
                        statistics[f'{col1} - {col2}']['t_stat'] = t_stat
                        statistics[f'{col1} - {col2}']['p_value_t'] = p_value_t

                        #ANOVA
                        f_stat, p_value_anova = f_oneway(data1, data2)
                        statistics[f'{col1} - {col2}']['f_stat'] = f_stat
                        statistics[f'{col1} - {col2}']['p_value_anova'] = p_value_anova

        print(statistics)
        return JsonResponse(statistics)
    else:
        return JsonResponse({'error': 'Metoda GET jest wymagana.'}, status=400)
    

@csrf_exempt
def download_modified_dataframe(request):
    global df

    if request.method == 'GET':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="result.csv"'

        writer = csv.writer(response)

        writer.writerow(df.columns)

        for index, row in df.iterrows():
            writer.writerow(row)

        return response
    else:
        return JsonResponse({'error': 'Metoda GET jest wymagana.'}, status=400)