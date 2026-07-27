from rest_framework.routers import DefaultRouter
from .views import UtilisateurViewSet, OffresViewSet, EnvoisViewSet

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet)
router.register(r'offres', OffresViewSet)
router.register(r'envois', EnvoisViewSet)

urlpatterns = router.urls