from django.urls import path
from .views import ClienteListCreateView, ClienteRetrieveUpdateDestroyView

urlpatterns = [
    path('clientes/', ClienteListCreateView.as_view(), name='cliente-list'),
    path('clientes/<int:pk>/', ClienteRetrieveUpdateDestroyView.as_view(), name='cliente-detail'),
]