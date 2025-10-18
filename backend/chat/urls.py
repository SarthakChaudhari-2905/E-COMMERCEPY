from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup),
    path('login/', views.login),
    path('products/', views.get_products),
    path('products/<int:pk>/', views.get_product),
    path('products/add/', views.add_product),
    path('products/update/<int:pk>/', views.update_product),
    path('products/delete/<int:pk>/', views.delete_product),
]
