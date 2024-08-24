"""
URL configuration for wasted project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from wasted.views.main_view import MainView, DoneView, GoodsView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('buy/', MainView.as_view()),
    path('done', DoneView.as_view(), name='done_page'),
    path('goods', GoodsView.as_view(), name='goods_page')
]
