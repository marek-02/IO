from django.urls import path
from .views import detect_data_types, change_variable_name, change_variable_type, generate_statistics_1d, delete_data, fill_missing_data, fill_outliers, generate_statistics_2d, download_modified_dataframe

urlpatterns = [
    path('detect/', detect_data_types, name='detect data types'),
    path('change_name/', change_variable_name, name='change variable name'),
    path('change_type/', change_variable_type, name='change variable type'),
    path('stats/1d', generate_statistics_1d, name='generate 1d statistics'),
    path('stats/2d/', generate_statistics_2d, name='generate 2d statistics'),
    path('delete/', delete_data, name='delete_data'),
    path('fill/missings/', fill_missing_data, name='fill missing data'),
    path('fill/outliers/', fill_outliers, name='fill outliners'),
    path('result/', download_modified_dataframe, name='download result'),
]
