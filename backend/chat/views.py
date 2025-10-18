from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Product, User
from .serializers import ProductSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# ------------------ SIGNUP ------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Hash the password before saving
        user.set_password(request.data['password'])
        user.save()
        return Response({"msg": "User created successfully"}, status=201)
    return Response(serializer.errors, status=400)

# ------------------ LOGIN ------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "token": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                }
            })
        else:
            return Response({"msg": "Invalid credentials"}, status=400)
    except User.DoesNotExist:
        return Response({"msg": "Invalid credentials"}, status=400)

# ------------------ GET ALL PRODUCTS ------------------
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# ------------------ GET SINGLE PRODUCT ------------------
@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"msg": "Product not found"}, status=404)

# ------------------ ADD PRODUCT (ADMIN ONLY) ------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
    if request.user.role != 'admin':
        return Response({"msg": "Access denied"}, status=403)
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# ------------------ UPDATE PRODUCT (ADMIN ONLY) ------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    if request.user.role != 'admin':
        return Response({"msg": "Access denied"}, status=403)
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    except Product.DoesNotExist:
        return Response({"msg": "Product not found"}, status=404)

# ------------------ DELETE PRODUCT (ADMIN ONLY) ------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    if request.user.role != 'admin':
        return Response({"msg": "Access denied"}, status=403)
    try:
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response({"msg": "Product deleted successfully"})
    except Product.DoesNotExist:
        return Response({"msg": "Product not found"}, status=404)

# ------------------ GET ALL PRODUCTS (Supports Category Filter) ------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def get_products(request):
    category = request.GET.get('category')  # e.g. /api/products/?category=men

    if category:
        products = Product.objects.filter(category__iexact=category)
    else:
        products = Product.objects.all()

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
