#!/bin/bash

# Script test API nhanh cho localhost
# Đảm bảo server đang chạy: npm run start:dev

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧪 Testing API on $BASE_URL"
echo "================================"

# Test 1: Health check
echo ""
echo -e "${BLUE}1️⃣ Testing health endpoint...${NC}"
HEALTH=$(curl -s $BASE_URL/)
if [ -n "$HEALTH" ]; then
  echo -e "${GREEN}✅ Server is running!${NC}"
  echo "Response: $HEALTH"
else
  echo -e "${RED}❌ Server is not responding!${NC}"
  exit 1
fi

# Test 2: Register user
echo ""
echo -e "${BLUE}2️⃣ Registering new user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser$(date +%s)\",\"password\":\"test123\"}")

if echo "$REGISTER_RESPONSE" | grep -q '"id"'; then
  echo -e "${GREEN}✅ User registered successfully!${NC}"
  echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))" 2>/dev/null || echo "$REGISTER_RESPONSE"
else
  echo -e "${RED}❌ Registration failed!${NC}"
  echo "$REGISTER_RESPONSE"
fi

# Test 3: Login (use demo user that we know exists)
echo ""
echo -e "${BLUE}3️⃣ Logging in with demo user...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}')

if echo "$LOGIN_RESPONSE" | grep -q 'access_token'; then
  echo -e "${GREEN}✅ Login successful!${NC}"
else
  echo -e "${RED}❌ Login failed!${NC}"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to get token!${NC}"
  exit 1
fi

echo "Token: ${TOKEN:0:50}..."

# Test 4: Protected endpoint
echo ""
echo -e "${BLUE}4️⃣ Testing protected endpoint /whoami...${NC}"
WHOAMI_RESPONSE=$(curl -s $BASE_URL/whoami \
  -H "Authorization: Bearer $TOKEN")

if echo "$WHOAMI_RESPONSE" | grep -q '"user"'; then
  echo -e "${GREEN}✅ Protected endpoint working!${NC}"
  echo "$WHOAMI_RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))" 2>/dev/null || echo "$WHOAMI_RESPONSE"
else
  echo -e "${RED}❌ Protected endpoint failed!${NC}"
  echo "$WHOAMI_RESPONSE"
fi

# Test 5: Create customer
echo ""
echo -e "${BLUE}5️⃣ Creating customer...${NC}"
CUSTOMER_RESPONSE=$(curl -s -X POST $BASE_URL/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0901234567",
    "address": "123 Nguyen Hue, Q1, TPHCM"
  }')

if echo "$CUSTOMER_RESPONSE" | grep -q '"id"'; then
  echo -e "${GREEN}✅ Customer created!${NC}"
  echo "$CUSTOMER_RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))" 2>/dev/null || echo "$CUSTOMER_RESPONSE"
else
  echo -e "${RED}⚠️  Customer creation may have failed (could be duplicate)${NC}"
  echo "$CUSTOMER_RESPONSE"
fi

# Test 6: Create product
echo ""
echo -e "${BLUE}6️⃣ Creating product...${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST $BASE_URL/catalog/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Whey Protein Gold Standard",
    "description": "Whey protein cao cấp từ Optimum Nutrition",
    "category": "Supplements"
  }')

if echo "$PRODUCT_RESPONSE" | grep -q '"id"'; then
  echo -e "${GREEN}✅ Product created!${NC}"
  echo "$PRODUCT_RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))" 2>/dev/null || echo "$PRODUCT_RESPONSE"
else
  echo -e "${RED}⚠️  Product creation response:${NC}"
  echo "$PRODUCT_RESPONSE"
fi

# Test 7: Get products
echo ""
echo -e "${BLUE}7️⃣ Getting all products...${NC}"
PRODUCTS_LIST=$(curl -s $BASE_URL/catalog/products \
  -H "Authorization: Bearer $TOKEN")

if echo "$PRODUCTS_LIST" | grep -q '\['; then
  echo -e "${GREEN}✅ Products retrieved!${NC}"
  echo "$PRODUCTS_LIST" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))" 2>/dev/null || echo "$PRODUCTS_LIST"
else
  echo "$PRODUCTS_LIST"
fi

# Test 8: Get customers
echo ""
echo -e "${BLUE}8️⃣ Getting all customers...${NC}"
CUSTOMERS_LIST=$(curl -s $BASE_URL/customers \
  -H "Authorization: Bearer $TOKEN")

if echo "$CUSTOMERS_LIST" | grep -q 'data'; then
  echo -e "${GREEN}✅ Customers retrieved!${NC}"
  echo "$CUSTOMERS_LIST" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))" 2>/dev/null || echo "$CUSTOMERS_LIST"
else
  echo "$CUSTOMERS_LIST"
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ API Tests Complete!${NC}"
echo ""
echo "💡 Next steps:"
echo "  - Open Swagger UI: ${BLUE}http://localhost:3000/api${NC}"
echo "  - View database: docker exec mysql-db mysql -u root -p\"Dpfam278@\" projectii -e \"SELECT * FROM users;\""
echo "  - Run e2e tests: npm run test:e2e"
echo "  - Check server logs: tail -f server.log"

