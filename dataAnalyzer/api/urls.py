from django.urls import path
from .views import detect_data_types, change_variable_name, change_variable_type, generate_statistics, delete_data, fill_missing_data

urlpatterns = [
    path('detect/', detect_data_types, name='detect_data_types'),
    path('change_name/', change_variable_name, name='change_variable_name'),
    path('change_type/', change_variable_type, name='change_variable_type'),
    path('stats/', generate_statistics, name='generate_statistics'),
    path('delete/', delete_data, name='delete_data'),
    path('fill/', fill_missing_data, name='fill_missing_data'),
]
