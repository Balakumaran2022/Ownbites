Postman collection, the overall API structure

OWNCART
│
├── 1. Organization
│   ├── Get Organization
│   ├── Outlet Get All
│   ├── Get Store Status
│   └── Settings Get
│
├── 2. Customer
│   ├── Customer Login
│   ├── Verify OTP
│   ├── Customer Orders Get
│   ├── Get Address by Lat/Lng
│   ├── Get Saved Address
│   ├── Get Full Address
│   └── Create Address
│
├── 3. Product
│   ├── Get Category with Item
│   ├── Get Item Detail
│   └── Get Item Detail with Variation
│
├── 4. Cart
│   ├── Get Cart Details
│   ├── Create Cart
│   ├── Update Cart with Addon
│   ├── Update Variation Product
│   ├── Customize Addon
│   ├── Delete Item
│   ├── Update Instruction
│   └── Update Order Type
│
├── 5. Discount
│   ├── Get Customer Discounts
│   └── Apply Discount
│
└── 6. Banner
    └── Customer Get

Overall Flow

    Organization
      │
      ▼
Customer Login
      │
      ▼
Verify OTP
      │
      ▼
Address Management
      │
      ▼
Product Listing
      │
      ▼
Product Details
      │
      ▼
Add to Cart
      │
      ▼
Update Cart
      │
      ▼
Apply Discount
      │
      ▼
Place Order (Customer Orders)

Good. This is the **first API (Organization)**. Here's the analysis you should document.

# API 1 - Get Organization

### Endpoint

```http
POST https://backend3.owct.me/organization/get-org
```

### Request Body

```json
{
  "domain": "ieyal"
}
```

### Response

**Status:** ✅ Success

```json
{
  "message": "Data retrieved",
  "status": "success"
}
```

---

# Data Analysis

## Organization Information

| Field             | Value                                       |
| ----------------- | ------------------------------------------- |
| Organization Name | IEYAL                                       |
| Domain            | ieyal                                       |
| Website           | [www.owncart.shop](http://www.owncart.shop) |
| Type              | Textiles & Garments                         |
| Active            | ✅ Yes                                       |
| Multiple Outlets  | ✅ Yes                                       |

---

## Contact Information

| Field    | Value          |
| -------- | -------------- |
| Phone    | +91 8124188187 |
| WhatsApp | +91 8124188187 |

---

## Location

| Field     | Value         |
| --------- | ------------- |
| City      | Aligarh       |
| State     | Uttar Pradesh |
| Country   | India         |
| Time Zone | Asia/Kolkata  |

---

## Store Configuration

| Setting          | Status  |
| ---------------- | ------- |
| Store Open       | ✅ Yes   |
| Cart Enabled     | ✅ Yes   |
| Door Delivery    | ✅ Yes   |
| Self Pickup      | ✅ Yes   |
| Location Sorting | ✅ Yes   |
| Login Alert      | Enabled |
| Login Mode       | Initial |

---

## Theme Configuration

| Setting         | Value   |
| --------------- | ------- |
| Theme           | theme1  |
| Primary Color   | #0c6cea |
| Secondary Color | #082e16 |
| Background      | #f7faff |
| Text Color      | #0f172a |
| Product Layout  | layout1 |

---

## Domain Configuration

| Field  | Value                                                  |
| ------ | ------------------------------------------------------ |
| Domain | ieyal                                                  |
| Setup  | Completed                                              |
| URL    | [https://ieyal.foodably.in](https://ieyal.foodably.in) |

---

## Important Values for Frontend

Use these values dynamically instead of hardcoding them:

* ✅ Organization Name
* ✅ Logo URL
* ✅ Theme Colors
* ✅ Store Status
* ✅ Cart Enabled
* ✅ Delivery Options
* ✅ Pickup Options
* ✅ Multiple Outlets
* ✅ Domain URL
* ✅ Organization Type

---

# Frontend Impact

This API should be called **immediately after the application loads** because it provides the application's configuration.

```
App Starts
      │
      ▼
Get Organization API
      │
      ├── Apply Theme Colors
      ├── Display Logo
      ├── Check Store Status
      ├── Check Cart Availability
      ├── Check Delivery Options
      └── Load Home Page
```

## Test Result

| Test               | Status     |
| ------------------ | ---------- |
| API Reachable      | ✅ Pass     |
| Response Status    | ✅ Success  |
| Organization Data  | ✅ Received |
| Theme Config       | ✅ Received |
| Store Settings     | ✅ Received |
| Ready for Frontend | ✅ Yes      |

**Conclusion:** This API serves as the application's initial configuration endpoint. It should be invoked first during app initialization to fetch branding, theme, store settings, and feature flags before rendering the UI.



## API 2 - Get All Outlets

### Endpoint

```http
POST https://backend3.owct.me/organization/outlets/get-all
```

### Request

```json
{
  "belongsTo": "685670e4486951278738864e",
  "locationSorting": true,
  "lat": 10.777460082400633,
  "lng": 79.63451395714621
}
```

### Response

* ✅ Status: `success`
* ✅ Message: `Data retrieved`
* ✅ Total Outlets: **8** 

---

# Purpose

This API returns all available outlets (stores/branches) for the organization. If `locationSorting` is enabled, the outlets are sorted based on the customer's latitude and longitude. 

---

# Input Parameters

| Parameter       | Purpose                          |
| --------------- | -------------------------------- |
| belongsTo       | Organization ID                  |
| locationSorting | Sort outlets by nearest location |
| lat             | Customer Latitude                |
| lng             | Customer Longitude               |

---

# Response Analysis

Each outlet contains:

### Basic Information

* Outlet ID
* Outlet Name
* Store Status
* Active Status

### Location

* Address
* City
* State
* Country
* Latitude
* Longitude
* Distance from customer

### Contact

* Contact Number

### Store Settings

* Cart Enabled
* POS Store Status
* Currency Symbol
* Currency Code

### Delivery

* Door Delivery
* Self Pickup
* Delivery Partner

### Working Hours

* Monday–Sunday timings
* Holiday Mode
* Working Hours Enabled

### Setup

* Basic Details
* Operating Hours
* Delivery Settings
* Payment Settings
* POS Settings

---

# Important Frontend Fields

Use these dynamically:

* ✅ Outlet Name
* ✅ Address
* ✅ Distance
* ✅ Store Status
* ✅ Working Hours
* ✅ Order Types
* ✅ Currency
* ✅ Delivery Partner
* ✅ Contact Number

---

# Frontend Usage

```text
App Load
    │
    ▼
Get Organization
    │
    ▼
Get All Outlets
    │
    ├── Show Nearest Outlet
    ├── Display Outlet List
    ├── Show Distance
    ├── Check Store Open/Closed
    ├── Show Delivery Options
    └── Select Outlet
```

---

# UI Components Required

* Outlet Selection Card
* Store Status Badge (Open/Closed)
* Distance Display
* Delivery Type Badge
* Working Hours Section
* Address & Contact Details

---

# Test Result

| Test               | Status      |
| ------------------ | ----------- |
| API Reachable      | ✅ Pass      |
| Response Status    | ✅ Success   |
| Outlet Data        | ✅ Received  |
| Location Sorting   | ✅ Working   |
| Store Status       | ✅ Available |
| Working Hours      | ✅ Available |
| Delivery Options   | ✅ Available |
| Ready for Frontend | ✅ Yes       |

### Conclusion

This API should be called immediately after **Get Organization**. It provides the list of available outlets, sorts them based on the customer's location (when enabled), and returns all the information needed for outlet selection, delivery options, store availability, and operational details before the user starts shopping.




## API 3 - Get Store Status

### Endpoint

```http
POST https://backend3.owct.me/organization/get-store-status/{organizationId}
```

**Example**

```http
POST https://backend3.owct.me/organization/get-store-status/685670e4486951278738864e
```

---

### Request Body

```json
{
  "outletId": "68e50210e60db7f4187e031e",
  "belongsTo": "685670e4486951278738864e"
}
```

---

### Response

```json
{
  "message": "Data retrieved",
  "status": "success",
  "data": {
    "organization": {
      "_id": "68e50210e60db7f4187e031e",
      "storeStatus": true,
      "manualOverrideType": null,
      "overrideEndTime": null
    }
  }
}
```

---

# Purpose

This API checks whether the selected outlet is currently open and available to accept orders.

---

# Input Parameters

| Parameter            | Purpose            |
| -------------------- | ------------------ |
| organizationId (URL) | Organization ID    |
| outletId             | Selected Outlet ID |
| belongsTo            | Organization ID    |

---

# Response Analysis

| Field              | Description                       |
| ------------------ | --------------------------------- |
| _id                | Outlet ID                         |
| storeStatus        | Store Open/Closed Status          |
| manualOverrideType | Manual override mode (if applied) |
| overrideEndTime    | Override end time                 |

---

# Frontend Usage

The frontend should use this API before allowing users to browse or place orders.

If:

* ✅ `storeStatus = true` → Allow shopping.
* ❌ `storeStatus = false` → Show **"Store is currently closed"** and disable ordering.

---

# UI Components

* 🟢 Store Open Badge
* 🔴 Store Closed Banner
* Disabled "Add to Cart" / "Checkout" buttons when closed
* Optional countdown if `overrideEndTime` is available

---

# Application Flow

```text
App Start
    │
    ▼
Get Organization
    │
    ▼
Get All Outlets
    │
    ▼
Select Outlet
    │
    ▼
Get Store Status
    │
    ├── Store Open → Continue Shopping
    └── Store Closed → Show Closed Message
```

---

# Test Result

| Test               | Status      |
| ------------------ | ----------- |
| API Reachable      | ✅ Pass      |
| Response Status    | ✅ Success   |
| Store Status       | ✅ Received  |
| Manual Override    | ✅ Available |
| Ready for Frontend | ✅ Yes       |

### Conclusion

This API acts as a **store availability check**. It should be called after the user selects an outlet to determine whether ordering is currently allowed. The frontend can use the returned `storeStatus` to enable or disable shopping features dynamically.


## API 4 - Get Settings

### Endpoint

```http
POST https://backend3.owct.me/setting/get
```

### Request Body

```json
{
  "outletId": "68e50210e60db7f4187e031e",
  "belongsTo": "685670e4486951278738864e"
}
```

---

### Response

```json
{
  "success": true,
  "data": {
    "preBookingEnabled": true,
    "checkOutSettings": {
      "enableDiscounts": true,
      "loyaltyMinimumAmount": 399,
      "applyDiscount": false,
      "calculateLoyality": false,
      "showRewards": false
    },
    "paymentMode": [
      "COD",
      "ONLINE"
    ],
    "defaultPaymentMode": "COD",
    "banner": {
      "autoScroll": true,
      "enable": true
    },
    "isInvoicePdfGenerated": false,
    "pos": "petpooja"
  }
}
```

---

# Purpose

This API returns the **store configuration settings** that control checkout, payments, banners, loyalty, and POS integration. The frontend should load these settings after the outlet is selected.

---

# Input Parameters

| Parameter | Purpose            |
| --------- | ------------------ |
| outletId  | Selected Outlet ID |
| belongsTo | Organization ID    |

---

# Response Analysis

## Pre-Booking

| Field             | Value | Usage                              |
| ----------------- | ----- | ---------------------------------- |
| preBookingEnabled | true  | Allow customers to pre-book orders |

---

## Checkout Settings

| Field                | Value | Usage                                 |
| -------------------- | ----- | ------------------------------------- |
| enableDiscounts      | true  | Enable coupon/discount section        |
| loyaltyMinimumAmount | 399   | Minimum amount to earn loyalty points |
| applyDiscount        | false | Auto discount disabled                |
| calculateLoyality    | false | Loyalty calculation disabled          |
| showRewards          | false | Hide rewards section                  |

---

## Payment Settings

| Field           | Value       |
| --------------- | ----------- |
| Payment Modes   | COD, ONLINE |
| Default Payment | COD         |

---

## Banner Settings

| Field          | Value |
| -------------- | ----- |
| Banner Enabled | Yes   |
| Auto Scroll    | Yes   |

---

## Other Settings

| Field           | Value    |
| --------------- | -------- |
| Invoice PDF     | Disabled |
| POS Integration | Petpooja |

---

# Frontend Usage

Use this API to configure the application dynamically.

* ✅ Show/Hide Discount Section
* ✅ Show Available Payment Methods
* ✅ Select Default Payment Mode
* ✅ Enable Auto-Scrolling Banner
* ✅ Enable/Disable Pre-Booking
* ✅ Configure Checkout Screen
* ✅ Integrate POS-specific behavior if required

---

# UI Components Affected

* Checkout Page
* Payment Selection
* Coupon Section
* Banner Carousel
* Rewards/Loyalty Section
* Pre-Booking Option

---

# Application Flow

```text
App Start
    │
    ▼
Get Organization
    │
    ▼
Get Outlets
    │
    ▼
Select Outlet
    │
    ▼
Get Store Status
    │
    ▼
Get Settings
    │
    ├── Configure Checkout
    ├── Configure Payments
    ├── Configure Banner
    ├── Configure Discounts
    └── Load Home Screen
```

---

# Test Result

| Test               | Status     |
| ------------------ | ---------- |
| API Reachable      | ✅ Pass     |
| Response Status    | ✅ Success  |
| Checkout Settings  | ✅ Received |
| Payment Modes      | ✅ Received |
| Banner Settings    | ✅ Received |
| POS Configuration  | ✅ Received |
| Ready for Frontend | ✅ Yes      |

### Conclusion

This API provides the **runtime configuration** for the selected outlet. Instead of hardcoding features like payment methods, discounts, banners, and pre-booking, the frontend should use this response to dynamically configure the application's behavior and checkout experience.


CUSTOMER 

## API 5 - Customer Login (OTP)

### Endpoint

```http
POST https://backend3.owct.me/customer/login
```

### Request Body

```json
{
  "phone": "919385452868",
  "belongsTo": "685670e4486951278738864e",
  "mode": "otp"
}
```

---

### Response

```json
{
  "status": "success",
  "mode": "otp",
  "message": "OTP sent successfully"
}
```

---

# Purpose

This API initiates customer authentication by sending an OTP to the registered mobile number. It is the first step in the login process.

---

# Input Parameters

| Parameter | Purpose                                    |
| --------- | ------------------------------------------ |
| phone     | Customer mobile number (with country code) |
| belongsTo | Organization ID                            |
| mode      | Login method (otp)                         |

---

# Response Analysis

| Field   | Description                |
| ------- | -------------------------- |
| status  | API execution status       |
| mode    | Authentication mode (OTP)  |
| message | Confirms OTP has been sent |

---

# Frontend Usage

The frontend should:

* Validate the mobile number.
* Call the Login API.
* If the response is successful, navigate to the OTP Verification screen.
* Start the OTP resend timer (e.g., 30–60 seconds).
* Display a success message such as **"OTP sent successfully"**.

---

# UI Components

* Mobile Number Input
* Country Code Selector
* Continue / Send OTP Button
* Loading Indicator
* Error Message (Invalid Number / API Failure)

---

# Authentication Flow

```text
Login Screen
      │
      ▼
Enter Mobile Number
      │
      ▼
Customer Login API
      │
      ├── Success → OTP Sent
      │              │
      │              ▼
      │        Navigate to OTP Screen
      │
      └── Failure → Show Error Message
```

---

# Test Result

| Test                       | Status    |
| -------------------------- | --------- |
| API Reachable              | ✅ Pass    |
| Response Status            | ✅ Success |
| OTP Triggered              | ✅ Yes     |
| Ready for OTP Verification | ✅ Yes     |

### Conclusion

This API is the **first step of customer authentication**. It validates the customer's mobile number and triggers OTP generation. On a successful response, the frontend should redirect the user to the OTP verification page, where the next API (`Verify OTP`) will complete the login process.



## API 6 - Verify OTP

### Endpoint

```http
POST https://backend3.owct.me/customer/verify-otp
```

### Request Body

```json
{
  "phone": "917695980064",
  "belongsTo": "685670e4486951278738864e",
  "otp": "191792"
}
```

---

### Response

```json
{
  "status": "success",
  "data": {
    "customer": {
      "_id": "6a50889213f8843577f4e27d",
      "name": "917695980064",
      "phone": "917695980064",
      "customerType": "opportunity",
      "newCustomer": true,
      "totalOrders": 0
    },
    "token": "JWT_TOKEN"
  }
}
```

---

# Purpose

This API verifies the OTP entered by the customer. On successful verification, it authenticates the user and returns the customer profile along with a JWT authentication token.

---

# Input Parameters

| Parameter | Purpose                     |
| --------- | --------------------------- |
| phone     | Customer mobile number      |
| belongsTo | Organization ID             |
| otp       | OTP entered by the customer |

---

# Response Analysis

## Customer Details

| Field         | Value              |
| ------------- | ------------------ |
| Customer ID   | Unique Customer ID |
| Name          | Customer Name      |
| Phone         | Mobile Number      |
| Customer Type | opportunity        |
| New Customer  | true               |
| Total Orders  | 0                  |

---

## Authentication

| Field | Description              |
| ----- | ------------------------ |
| Token | JWT Authentication Token |

> **Important:** Store this JWT token securely (e.g., localStorage or secure storage) and send it in the `Authorization: Bearer <token>` header for all protected APIs.

---

# Frontend Usage

After successful OTP verification:

* ✅ Save the JWT token.
* ✅ Save customer information.
* ✅ Mark the user as logged in.
* ✅ Navigate to the Home screen.
* ✅ Use the token for subsequent authenticated API calls.

---

# UI Components

* OTP Input (6 digits)
* Verify Button
* Resend OTP
* Loading Indicator
* Invalid OTP Error Message

---

# Authentication Flow

```text
Login Screen
      │
      ▼
Customer Login API
      │
      ▼
OTP Screen
      │
      ▼
Verify OTP API
      │
      ├── Success
      │      │
      │      ├── Save JWT Token
      │      ├── Save Customer Profile
      │      └── Navigate to Home
      │
      └── Failure
             │
             └── Show "Invalid OTP"
```

---

# Test Result

| Test                     | Status     |
| ------------------------ | ---------- |
| API Reachable            | ✅ Pass     |
| OTP Verification         | ✅ Success  |
| Customer Data            | ✅ Received |
| JWT Token                | ✅ Received |
| Authentication           | ✅ Success  |
| Ready for Protected APIs | ✅ Yes      |

### Conclusion

This is the **authentication completion API**. It verifies the OTP, creates or retrieves the customer profile, and returns a JWT token. From this point onward, the frontend should treat the user as authenticated and include the JWT token in all secured API requests. This API marks the transition from the login flow to the authenticated shopping experience.


## API 7- Get Customer Orders

### Endpoint

```http
POST https://backend3.owct.me/order/get-all-order-by-customer?page=1&limit=20
```

### Request Body

```json
{}
```

---

### Response

```json
{
    "success": true,
    "data": [],
    "totalOrders": 0,
    "pagination": {
        "limit": 20,
        "thisPage": 0,
        "currentPage": 1
    }
}
```

---

# API Test Report

### Purpose

This API retrieves the authenticated customer's order history with pagination support.

---

### Test Status

| Parameter        | Result             |
| ---------------- | ------------------ |
| API Reachable    | ✅ Yes              |
| Request Method   | POST               |
| Authentication   | ✅ Success          |
| Response Status  | ✅ Success          |
| Orders Retrieved | ✅ Yes (Empty List) |
| Pagination       | ✅ Available        |

---

### Response Analysis

| Field        | Value       |
| ------------ | ----------- |
| Success      | true        |
| Total Orders | 0           |
| Data         | Empty Array |
| Current Page | 1           |
| Page Limit   | 20          |

---

### Observation

* Authentication is working correctly.
* API executed successfully.
* No customer orders are currently available.
* Pagination details were returned as expected.

---

### Expected Behaviour

The API should return:

* Customer order list
* Order status
* Order items
* Order amount
* Order date and time
* Pagination details

If the customer has no previous orders, an empty array should be returned.

---

### Current Result

✅ **API Test Passed**

**Reason:**

* The API authenticated successfully.
* The response format is valid.
* The customer currently has no order history (`totalOrders: 0`).

---

### Frontend Usage

The frontend should:

* Display the customer's order history.
* If `data` is empty, show a **"No Orders Found"** message.
* Support pagination using the `pagination` object for future orders.

---

### Conclusion

The **Get Customer Orders** API is functioning correctly. Authentication is successful, and the endpoint returns a valid response. Since the customer has not placed any orders yet, the API correctly returns an empty order list with pagination information.





## API 8 - Customer Geo Location

### Endpoint

```http
POST https://backend3.owct.me/location/customer-geo-location
```

### Request Body

```json
{
  "latitude": 10.777460082400633,
  "longitude": 79.63451395714621,
  "belongsTo": "685670e4486951278738864e"
}
```

---

### Response

```json
{
  "success": true,
  "data": {
    "results": [...],
    "latitude": 10.77768,
    "longitude": 79.63459
  }
}
```

---

# API Test Report

### Purpose

This API converts the customer's latitude and longitude into a human-readable address (Reverse Geocoding). It is used to identify the customer's current location and serviceable address.

---

### Test Status

| Parameter         | Result    |
| ----------------- | --------- |
| API Reachable     | ✅ Yes     |
| Request Method    | POST      |
| Response Status   | ✅ Success |
| Reverse Geocoding | ✅ Success |
| Address Retrieved | ✅ Yes     |

---

### Response Analysis

| Field     | Value                    |
| --------- | ------------------------ |
| Success   | true                     |
| Latitude  | 10.77768                 |
| Longitude | 79.63459                 |
| Results   | Multiple Address Matches |

---

### Primary Address

| Field             | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Formatted Address | Vasan Nagar, Kodikkalpalayam, Thiruvarur, Tamil Nadu 610001, India |
| City              | Thiruvarur                                                         |
| State             | Tamil Nadu                                                         |
| Country           | India                                                              |
| Postal Code       | 610001                                                             |
| Place ID          | Available                                                          |

---

### Additional Data Returned

* ✅ Multiple formatted addresses
* ✅ Address components
* ✅ Geographic coordinates
* ✅ Viewport and bounds
* ✅ Navigation points
* ✅ Place IDs
* ✅ Location type (APPROXIMATE / ROOFTOP)

---

# Frontend Usage

The frontend can use this API to:

* Detect the customer's current location.
* Display the formatted delivery address.
* Auto-fill the address during checkout.
* Allow users to select from multiple matching addresses.
* Validate serviceable delivery locations.
* Show the selected location on a map.

---

# UI Components

* Current Location Card
* Address Selector
* Map View
* Change Location Button
* Confirm Delivery Address
* Saved Address Form

---

# Application Flow

```text
Get Device Location
        │
        ▼
Customer Geo Location API
        │
        ▼
Receive Formatted Addresses
        │
        ├── Display Current Address
        ├── Show Nearby Address Options
        ├── Confirm Delivery Location
        └── Proceed to Shopping
```

---

# Test Result

| Test               | Status      |
| ------------------ | ----------- |
| API Reachable      | ✅ Pass      |
| Reverse Geocoding  | ✅ Success   |
| Address Data       | ✅ Received  |
| Coordinates        | ✅ Valid     |
| Place Information  | ✅ Available |
| Ready for Frontend | ✅ Yes       |

### Conclusion

The **Customer Geo Location** API is functioning correctly. It successfully converts the customer's latitude and longitude into multiple formatted addresses using reverse geocoding. The response includes detailed address information, geographic coordinates, and place metadata, making it suitable for location selection, delivery validation, and checkout address auto-fill in the frontend.


## API 9 - Get Customer Addresses

### Endpoint

```http
POST https://backend3.owct.me/customer/get-addresses?page=1&limit=20
```

### Request Body

```json
{
  "customerPhoneNo": "917695980064",
  "lat": 10.777457452521146,
  "lng": 79.63459824075451
}
```

---

### Response

```json
{
  "message": "Data retrieved",
  "status": "success",
  "data": [],
  "totalCount": 0,
  "pagination": {
    "limit": 20,
    "thisPage": 0
  }
}
```

---

# API Test Report

### Purpose

This API retrieves the authenticated customer's saved delivery addresses with pagination support.

---

### Test Status

| Parameter       | Result                   |
| --------------- | ------------------------ |
| API Reachable   | ✅ Yes                    |
| Request Method  | POST                     |
| Response Status | ✅ Success                |
| Address Data    | ✅ Retrieved (Empty List) |
| Pagination      | ✅ Available              |

---

### Response Analysis

| Field           | Value          |
| --------------- | -------------- |
| Status          | success        |
| Message         | Data retrieved |
| Total Addresses | 0              |
| Data            | Empty Array    |
| Page Limit      | 20             |
| Current Page    | 0              |

---

### Observation

* The API executed successfully.
* The customer currently has **no saved delivery addresses**.
* The response structure is valid and includes pagination details.
* The empty `data` array indicates that no addresses have been added yet.

---

### Expected Behaviour

On success, the API should return:

* Customer's saved addresses
* Default delivery address
* Address details
* Latitude and Longitude
* Pagination information

If no addresses exist, the API should return an empty array.

---

### Current Result

✅ **API Test Passed**

**Reason:**

* The API returned a successful response.
* No saved addresses are available for the customer (`totalCount: 0`).

---

### Frontend Usage

The frontend should:

* Display the customer's saved address list.
* If `data` is empty, show a **"No Saved Addresses"** message.
* Display an **"Add New Address"** button.
* Use pagination when the customer has multiple saved addresses.

---

### Conclusion

The **Get Customer Addresses** API is functioning correctly. It successfully returns the customer's saved address list with pagination support. Since the customer has not added any delivery addresses yet, the API correctly returns an empty array (`data: []`) and a `totalCount` of **0**.



## API 10 - Customer Get Latitude & Longitude

### Endpoint

```http
POST https://backend3.owct.me/location/customer-get-latlng
```

### Request Body

```json
{
  "enteredAddress": "ownchat",
  "belongsTo": "685670e4486951278738864e"
}
```

---

### Response

```json
{
  "status": "success",
  "count": 1,
  "results": [
    {
      "formatted_address": "Nethaji Rd, Rajgopal Nagar, Santhamangalam, Kodikkalpalayam, Thiruvarur, Tamil Nadu 610001, India",
      "geometry": {
        "location": {
          "lat": 10.7716886,
          "lng": 79.63816179999999
        }
      }
    }
  ]
}
```

---

# API Test Report

### Purpose

This API converts a user-entered address or search text into geographic coordinates (Latitude and Longitude). It is used for address search, location selection, and map positioning.

---

### Test Status

| Parameter          | Result    |
| ------------------ | --------- |
| API Reachable      | ✅ Yes     |
| Request Method     | POST      |
| Response Status    | ✅ Success |
| Geocoding          | ✅ Success |
| Location Retrieved | ✅ Yes     |

---

### Response Analysis

| Field             | Value                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Status            | success                                                                                           |
| Results Count     | 1                                                                                                 |
| Formatted Address | Nethaji Rd, Rajgopal Nagar, Santhamangalam, Kodikkalpalayam, Thiruvarur, Tamil Nadu 610001, India |
| Latitude          | 10.7716886                                                                                        |
| Longitude         | 79.6381618                                                                                        |
| Place ID          | Available                                                                                         |
| Location Type     | GEOMETRIC_CENTER                                                                                  |

---

### Additional Data Returned

* ✅ Formatted Address
* ✅ Latitude & Longitude
* ✅ Address Components
* ✅ Place ID
* ✅ Navigation Point
* ✅ Viewport Information
* ✅ Plus Code
* ✅ Place Type (Establishment / Point of Interest)

---

### Frontend Usage

The frontend can use this API to:

* Search locations by address or keyword.
* Display search suggestions.
* Pin the selected location on a map.
* Auto-fill delivery address details.
* Save customer delivery locations.
* Validate addresses before checkout.

---

### UI Components

* Address Search Box
* Search Suggestions List
* Interactive Map
* Location Pin
* Confirm Address Button
* Save Address Form

---

### Application Flow

```text
User Enters Address
        │
        ▼
Customer Get Lat/Lng API
        │
        ▼
Receive Coordinates
        │
        ├── Display Matching Address
        ├── Show Location on Map
        ├── Allow User Confirmation
        └── Save Delivery Address
```

---

### Test Result

| Test                  | Status      |
| --------------------- | ----------- |
| API Reachable         | ✅ Pass      |
| Address Search        | ✅ Success   |
| Coordinates Retrieved | ✅ Yes       |
| Place Information     | ✅ Available |
| Ready for Frontend    | ✅ Yes       |

### Conclusion

The **Customer Get Latitude & Longitude** API is functioning correctly. It successfully converts the user-entered address into geographic coordinates and returns detailed location information, including the formatted address, latitude, longitude, place ID, and navigation data. This API is suitable for implementing address search, map integration, and delivery location selection in the frontend.

## API 11 - Create Customer Address

### Endpoint

```http
POST https://backend3.owct.me/customer/create-address
```

### Request Body

```json
{
    "address1": "76",
    "address2": "Nethaji Rd, Rajgopal Nagar, Santhamangalam, Kodikkalpalayam",
    "city": "Thiruvarur",
    "state": "Tamil Nadu",
    "country": "India",
    "pincode": "610001",
    "latitude": 10.7716886,
    "longitude": 79.63816179999999,
    "landMark": "",
    "type": "work"
}
```

---

### Response

```json
{
    "status": "success",
    "data": {
        "_id": "6a509a31311022696496b271",
        "belongsTo": "685670e4486951278738864e",
        "customerPhone": "917695980064",
        "customerName": "917695980064",
        "address": "76, Nethaji Rd, Rajgopal Nagar, Santhamangalam, Kodikkalpalayam, Thiruvarur, Tamil Nadu, India, 610001",
        "address1": "76",
        "address2": "Nethaji Rd, Rajgopal Nagar, Santhamangalam, Kodikkalpalayam",
        "city": "Thiruvarur",
        "state": "Tamil Nadu",
        "pincode": "610001",
        "type": "work",
        "location": {
            "type": "Point",
            "coordinates": [
                79.63816179999999,
                10.7716886
            ]
        }
    }
}
```

---

# API Test Report

### Purpose

This API creates and saves a new delivery address for the authenticated customer.

---

### Test Status

| Parameter       | Result    |
| --------------- | --------- |
| API Reachable   | ✅ Yes     |
| Request Method  | POST      |
| Response Status | ✅ Success |
| Address Created | ✅ Yes     |
| Location Saved  | ✅ Yes     |

---

### Response Analysis

| Field          | Value                  |
| -------------- | ---------------------- |
| Status         | success                |
| Address ID     | Generated Successfully |
| Customer Phone | 917695980064           |
| Address Type   | work                   |
| City           | Thiruvarur             |
| State          | Tamil Nadu             |
| Country        | India                  |
| Pincode        | 610001                 |
| Latitude       | 10.7716886             |
| Longitude      | 79.63816179999999      |

---

### Additional Data Returned

* ✅ Address ID
* ✅ Customer Information
* ✅ Complete Formatted Address
* ✅ Address Type
* ✅ GeoJSON Location Object
* ✅ Latitude & Longitude
* ✅ Created Timestamp
* ✅ Last Used Timestamp

---

### Frontend Usage

The frontend can use this API to:

* Save a new delivery address.
* Store GPS coordinates for delivery.
* Maintain multiple address types (Home, Work, Other).
* Refresh the saved address list after successful creation.
* Automatically select the newly created address for checkout.

---

### UI Components

* Add Address Form
* Address Type Selector
* Save Address Button
* Success Notification
* Saved Address List

---

### Application Flow

```text
Customer Login
        │
        ▼
Enter Address Details
        │
        ▼
Create Address API
        │
        ▼
Address Saved Successfully
        │
        ├── Refresh Address List
        ├── Select New Address
        └── Continue to Checkout
```

---

### Test Result

| Test               | Status    |
| ------------------ | --------- |
| API Reachable      | ✅ Pass    |
| Address Creation   | ✅ Success |
| Customer Mapping   | ✅ Success |
| Location Saved     | ✅ Success |
| Ready for Frontend | ✅ Yes     |

### Conclusion

The **Create Customer Address** API is functioning correctly. It successfully saves the customer's delivery address along with location coordinates and returns the complete address details. The API is ready for frontend integration and can be used to implement the **Add New Address** feature in the customer checkout flow.


CARD
V## API 15 - Get Cart Details

### Endpoint

```http
POST https://backend3.owct.me/cart/get-cart-details
```

### Request Body

```json
{
    "customerPhoneNo": "919385452868",
    "outletId": "68e50210e60db7f4187e031e"
}
```

---

### Response

```json
{
    "status": "success",
    "message": "Cart retrieved successfully",
    "data": [
        {
            "orderId": "20260710122008355107",
            "orderType": "Door Delivery",
            "paymentMode": "COD",
            "paymentStatus": "Unpaid",
            "status": "Order Pending",
            "checkoutEnable": true
        }
    ]
}
```

---

# API Test Report

### Purpose

This API retrieves all active cart details for the customer in the selected outlet. It includes cart items, pricing, taxes, delivery charges, customer details, payment information, and checkout status.

---

## Test Status

| Parameter       | Result    |
| --------------- | --------- |
| API Reachable   | ✅ Yes     |
| Request Method  | POST      |
| Response Status | ✅ Success |
| Cart Retrieved  | ✅ Yes     |
| Checkout Status | ✅ Enabled |

---

## Response Analysis

| Field            | Value                       |
| ---------------- | --------------------------- |
| Status           | success                     |
| Message          | Cart retrieved successfully |
| Cart Records     | 3                           |
| Checkout Enabled | true                        |
| Payment Status   | Unpaid                      |
| Payment Mode     | COD                         |

---

## Cart Summary

### Cart 1

| Field           | Value         |
| --------------- | ------------- |
| Order Type      | Door Delivery |
| Items           | 1             |
| Order Total     | ₹792.95       |
| Delivery Charge | ₹500          |
| Saved Amount    | ₹105          |
| Checkout        | Enabled       |

---

### Cart 2

| Field           | Value           |
| --------------- | --------------- |
| Order Type      | Door Delivery   |
| Items           | 1 (Quantity: 2) |
| Order Total     | ₹1085.90        |
| Delivery Charge | ₹500            |
| Saved Amount    | ₹210            |
| Checkout        | Enabled         |

---

### Cart 3

| Field           | Value       |
| --------------- | ----------- |
| Order Type      | Self Pickup |
| Items           | 1           |
| Order Total     | ₹292.95     |
| Delivery Charge | ₹0          |
| Saved Amount    | ₹105        |
| Checkout        | Enabled     |

---

## Product Information Returned

* ✅ Product Name
* ✅ Product ID
* ✅ Quantity
* ✅ Add-on Details
* ✅ Item Price
* ✅ Base Price
* ✅ Tax Amount
* ✅ Package Charge
* ✅ Stock Status
* ✅ Item Total
* ✅ Discount Details

---

## Customer Information Returned

* ✅ Customer Name
* ✅ Customer Phone
* ✅ Customer Address
* ✅ Landmark
* ✅ Customer ID
* ✅ Loyalty Information
* ✅ Discount Codes (if available)

---

## Order Information Returned

* ✅ Order ID
* ✅ Order Status
* ✅ Payment Status
* ✅ Payment Mode
* ✅ Delivery Type
* ✅ Delivery Charge
* ✅ Checkout Availability
* ✅ Created Date
* ✅ Last Updated Date

---

## Frontend Usage

The frontend can use this API to:

* Display cart items.
* Update item quantities.
* Show item-wise pricing and taxes.
* Display delivery charges.
* Show savings and discounts.
* Display customer delivery address.
* Enable or disable the checkout button.
* Navigate to the payment page.

---

## UI Components

* Shopping Cart
* Cart Item Card
* Quantity Selector
* Price Summary
* Delivery Charge Section
* Saved Amount Badge
* Checkout Button
* Payment Summary
* Customer Address Card

---

## Application Flow

```text
Customer Login
        │
        ▼
Select Outlet
        │
        ▼
Get Cart Details API
        │
        ▼
Display Cart Items
        │
        ├── Update Quantity
        ├── Remove Item
        ├── Change Address
        ├── View Price Summary
        └── Proceed to Checkout
```

---

## Test Result

| Test               | Status      |
| ------------------ | ----------- |
| API Reachable      | ✅ Pass      |
| Cart Retrieval     | ✅ Success   |
| Product Data       | ✅ Available |
| Pricing Details    | ✅ Available |
| Customer Details   | ✅ Available |
| Checkout Status    | ✅ Enabled   |
| Ready for Frontend | ✅ Yes       |

---

## Conclusion

The **Get Cart Details** API is functioning correctly. It successfully returns the customer's active cart data, including product details, pricing, taxes, delivery charges, customer information, payment details, and checkout status. The response provides all the information required to build a complete **Cart** and **Checkout** page in the frontend.


CARD
## API 12- Get Cart Details

### Endpoint

```http
POST https://backend3.owct.me/cart/get-cart-details
```

### Request Body

```json
{
    "customerPhoneNo": "919385452868",
    "outletId": "68e50210e60db7f4187e031e"
}
```

---

### Response

```json
{
    "status": "success",
    "message": "Cart retrieved successfully",
    "data": [
        {
            "orderId": "20260710122008355107",
            "orderType": "Door Delivery",
            "paymentMode": "COD",
            "paymentStatus": "Unpaid",
            "status": "Order Pending",
            "checkoutEnable": true
        }
    ]
}
```

---

# API Test Report

### Purpose

This API retrieves all active cart details for the customer in the selected outlet. It includes cart items, pricing, taxes, delivery charges, customer details, payment information, and checkout status.

---

## Test Status

| Parameter       | Result    |
| --------------- | --------- |
| API Reachable   | ✅ Yes     |
| Request Method  | POST      |
| Response Status | ✅ Success |
| Cart Retrieved  | ✅ Yes     |
| Checkout Status | ✅ Enabled |

---

## Response Analysis

| Field            | Value                       |
| ---------------- | --------------------------- |
| Status           | success                     |
| Message          | Cart retrieved successfully |
| Cart Records     | 3                           |
| Checkout Enabled | true                        |
| Payment Status   | Unpaid                      |
| Payment Mode     | COD                         |

---

## Cart Summary

### Cart 1

| Field           | Value         |
| --------------- | ------------- |
| Order Type      | Door Delivery |
| Items           | 1             |
| Order Total     | ₹792.95       |
| Delivery Charge | ₹500          |
| Saved Amount    | ₹105          |
| Checkout        | Enabled       |

---

### Cart 2

| Field           | Value           |
| --------------- | --------------- |
| Order Type      | Door Delivery   |
| Items           | 1 (Quantity: 2) |
| Order Total     | ₹1085.90        |
| Delivery Charge | ₹500            |
| Saved Amount    | ₹210            |
| Checkout        | Enabled         |

---

### Cart 3

| Field           | Value       |
| --------------- | ----------- |
| Order Type      | Self Pickup |
| Items           | 1           |
| Order Total     | ₹292.95     |
| Delivery Charge | ₹0          |
| Saved Amount    | ₹105        |
| Checkout        | Enabled     |

---

## Product Information Returned

* ✅ Product Name
* ✅ Product ID
* ✅ Quantity
* ✅ Add-on Details
* ✅ Item Price
* ✅ Base Price
* ✅ Tax Amount
* ✅ Package Charge
* ✅ Stock Status
* ✅ Item Total
* ✅ Discount Details

---

## Customer Information Returned

* ✅ Customer Name
* ✅ Customer Phone
* ✅ Customer Address
* ✅ Landmark
* ✅ Customer ID
* ✅ Loyalty Information
* ✅ Discount Codes (if available)

---

## Order Information Returned

* ✅ Order ID
* ✅ Order Status
* ✅ Payment Status
* ✅ Payment Mode
* ✅ Delivery Type
* ✅ Delivery Charge
* ✅ Checkout Availability
* ✅ Created Date
* ✅ Last Updated Date

---

## Frontend Usage

The frontend can use this API to:

* Display cart items.
* Update item quantities.
* Show item-wise pricing and taxes.
* Display delivery charges.
* Show savings and discounts.
* Display customer delivery address.
* Enable or disable the checkout button.
* Navigate to the payment page.

---

## UI Components

* Shopping Cart
* Cart Item Card
* Quantity Selector
* Price Summary
* Delivery Charge Section
* Saved Amount Badge
* Checkout Button
* Payment Summary
* Customer Address Card

---

## Application Flow

```text
Customer Login
        │
        ▼
Select Outlet
        │
        ▼
Get Cart Details API
        │
        ▼
Display Cart Items
        │
        ├── Update Quantity
        ├── Remove Item
        ├── Change Address
        ├── View Price Summary
        └── Proceed to Checkout
```

---

## Test Result

| Test               | Status      |
| ------------------ | ----------- |
| API Reachable      | ✅ Pass      |
| Cart Retrieval     | ✅ Success   |
| Product Data       | ✅ Available |
| Pricing Details    | ✅ Available |
| Customer Details   | ✅ Available |
| Checkout Status    | ✅ Enabled   |
| Ready for Frontend | ✅ Yes       |

---

## Conclusion

The **Get Cart Details** API is functioning correctly. It successfully returns the customer's active cart data, including product details, pricing, taxes, delivery charges, customer information, payment details, and checkout status. The response provides all the information required to build a complete **Cart** and **Checkout** page in the frontend.


## API 13- Create Cart / Create Order

### Endpoint

```http
POST https://backend3.owct.me/cart/create
```

### Request Body

```json
{
  "items": [
    {
      "itemId": "69c77a1a175ccba18b84d221",
      "quantity": 1,
      "variationId": "",
      "addOnDetails": [
        {
          "group_id": "69c77a14175ccba18b84cfd9",
          "addon_item_ids": [
            "69e87423c8d69c72cabb6407"
          ]
        }
      ],
      "currency": "INR"
    }
  ],
  "deliveryType": "Door Delivery",
  "orderType": "Door Delivery",
  "customerName": "Safinamoideen",
  "customerPhoneNo": "919385452868",
  "instruction": "",
  "addressId": "6a5074361d5a14c9230a618a",
  "outletId": "68e50210e60db7f4187e031e"
}
```

---

### Response

```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "order": {
      "orderId": "20260710124817363586",
      "orderType": "Door Delivery",
      "status": "Order Pending",
      "paymentStatus": "Unpaid",
      "paymentMode": "COD",
      "orderTotal": 792.95
    }
  }
}
```

---

# API Test Report

### Purpose

This API creates a new cart/order for the customer by adding selected products, delivery details, and customer information. It calculates pricing, taxes, delivery charges, and generates a unique order.

---

## Test Status

| Parameter          | Result    |
| ------------------ | --------- |
| API Reachable      | ✅ Yes     |
| Request Method     | POST      |
| Response Status    | ✅ Success |
| Order Created      | ✅ Yes     |
| Pricing Calculated | ✅ Yes     |

---

## Response Analysis

| Field          | Value                      |
| -------------- | -------------------------- |
| Status         | success                    |
| Message        | Order created successfully |
| Order ID       | Generated Successfully     |
| Order Type     | Door Delivery              |
| Order Status   | Order Pending              |
| Payment Status | Unpaid                     |
| Payment Mode   | COD                        |

---

## Order Summary

| Field           | Value                       |
| --------------- | --------------------------- |
| Product         | Cheese Burst Chicken Burger |
| Quantity        | 1                           |
| Base Price      | ₹379                        |
| Selling Price   | ₹279                        |
| Tax             | ₹13.95                      |
| Delivery Charge | ₹500                        |
| Package Charge  | ₹0                          |
| Saved Amount    | ₹105                        |
| Grand Total     | ₹792.95                     |

---

## Product Information Returned

* ✅ Product ID
* ✅ Product Name
* ✅ Quantity
* ✅ Add-on Details
* ✅ Item Price
* ✅ Base Price
* ✅ Tax Details
* ✅ Package Charges
* ✅ Stock Status
* ✅ Item Total

---

## Customer Information Returned

* ✅ Customer Name
* ✅ Customer Phone Number
* ✅ Delivery Address
* ✅ Address ID
* ✅ Latitude & Longitude
* ✅ Customer ID

---

## Order Information Returned

* ✅ Order ID
* ✅ Order Status
* ✅ Payment Status
* ✅ Payment Mode
* ✅ Delivery Type
* ✅ Outlet ID
* ✅ Created Date
* ✅ Last Updated Date
* ✅ Restaurant ID
* ✅ Customer Mode

---

## Frontend Usage

The frontend can use this API to:

* Create a new cart/order.
* Validate selected products.
* Calculate taxes and delivery charges.
* Display order summary.
* Store customer delivery information.
* Redirect users to the checkout/payment screen.

---

## UI Components

* Product Details Card
* Shopping Cart
* Delivery Address Card
* Order Summary
* Price Breakdown
* Payment Method
* Place Order Button
* Order Confirmation Screen

---

## Application Flow

```text
Customer Selects Products
        │
        ▼
Add Quantity & Add-ons
        │
        ▼
Create Cart API
        │
        ▼
Order Created Successfully
        │
        ├── Display Order Summary
        ├── Show Delivery Address
        ├── Select Payment Method
        └── Proceed to Checkout
```

---

## Test Result

| Test               | Status    |
| ------------------ | --------- |
| API Reachable      | ✅ Pass    |
| Order Creation     | ✅ Success |
| Product Validation | ✅ Success |
| Price Calculation  | ✅ Success |
| Customer Mapping   | ✅ Success |
| Checkout Ready     | ✅ Yes     |

---

## Conclusion

The **Create Cart** API is functioning correctly. It successfully creates a new order with the selected products, add-ons, customer information, and delivery address. The API automatically calculates taxes, delivery charges, savings, and the final payable amount while generating a unique order ID. The response contains all the required data for the **Cart Review**, **Checkout**, and **Payment** pages, making it fully ready for frontend integration.


## API 14 - Update Cart / Update Order

### Endpoint

```http
POST https://backend3.owct.me/cart/update
```

### Request Body

```json
{
  "items": [
    {
      "itemId": "6a47374f33486b091abfeee",
      "quantity": 1,
      "variationId": "",
      "addOnDetails": [
        {
          "group_id": "6a47374e33486b0991abfcc1",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd92491"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfccf",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd92499"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfce6",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924a4",
            "6a47374ea22b80a9bdd924a6"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfcfc",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924af"
          ]
        }
      ],
      "currency": "INR"
    }
  ],
  "deliveryType": "Door Delivery",
  "orderType": "Door Delivery",
  "customerName": "Safinamoideen",
  "customerPhoneNo": "919385452868",
  "instruction": "",
  "addressId": "6a5074361d5a14c9230a618a",
  "orderId": "20260703153155004569",
  "outletId": "6a47361e1898af1200d559e1"
}
```

---

### Response

```json
{
  "message": "Order not found",
  "status": "failed"
}
```

---

# API Test Report

### Purpose

This API updates an existing customer cart/order by modifying products, quantities, add-ons, delivery information, or customer details.

---

## Test Status

| Parameter       | Result   |
| --------------- | -------- |
| API Reachable   | ✅ Yes    |
| Request Method  | POST     |
| Response Status | ❌ Failed |
| Cart Updated    | ❌ No     |

---

## Response Analysis

| Field   | Value           |
| ------- | --------------- |
| Status  | failed          |
| Message | Order not found |

---

## Observation

* The API endpoint is reachable.
* The request was processed.
* The specified `orderId` was not found in the system.
* No cart update was performed.

---

## Possible Reasons

* The provided **orderId** does not exist.
* The order has already been completed, cancelled, or deleted.
* The order belongs to a different outlet.
* The order belongs to a different organization.
* An invalid or outdated `orderId` was used.

---

## Expected Behaviour

If a valid order exists, the API should:

* Update cart items.
* Update quantities.
* Update add-ons.
* Recalculate taxes and total amount.
* Update delivery details.
* Return the updated order information.

---

## Current Result

❌ **API Test Failed**

**Reason:**
The API returned **"Order not found"**, indicating that the provided `orderId` could not be matched with any existing active order.

---

## Frontend Handling

The frontend should:

* Display an error message such as **"Order not found. Please refresh your cart and try again."**
* Prevent checkout until a valid cart is available.
* Optionally reload the latest cart using the **Get Cart Details** API.

---

## Conclusion

The **Update Cart** API endpoint is accessible, but the update operation failed because the supplied `orderId` was not found. Before calling this API, the frontend should ensure that it uses a valid and active `orderId` retrieved from the **Get Cart Details** or **Create Cart** API.



## API 14 - Update Cart (Multiple Items)

### Endpoint

```http
POST https://backend3.owct.me/cart/update
```

---

### Request Body

```json
{
  "items": [
    {
      "itemId": "6a47374f33486b0991abfeee",
      "quantity": 1,
      "variationId": "",
      "addOnDetails": [
        {
          "group_id": "6a47374e33486b0991abfcc1",
          "addon_item_ids": ["6a47374ea22b80a9bdd92491"]
        },
        {
          "group_id": "6a47374e33486b0991abfccf",
          "addon_item_ids": ["6a47374ea22b80a9bdd92499"]
        },
        {
          "group_id": "6a47374e33486b0991abfce6",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924a4",
            "6a47374ea22b80a9bdd924a6"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfcfc",
          "addon_item_ids": ["6a47374ea22b80a9bdd924af"]
        }
      ],
      "currency": "INR"
    },
    {
      "itemId": "6a47375233486b0991ac17fe",
      "quantity": 1,
      "variationId": "",
      "addOnDetails": [
        {
          "group_id": "6a47374e33486b0991abfcfc",
          "addon_item_ids": ["6a47374ea22b80a9bdd924af"]
        }
      ],
      "currency": "INR"
    },
    {
      "itemId": "6a47375233486b0991ac18a3",
      "quantity": 1,
      "variationId": "6a473752a22b80a9bdd92c20",
      "addOnDetails": [],
      "currency": "INR"
    }
  ],
  "deliveryType": "Door Delivery",
  "orderType": "Door Delivery",
  "customerName": "Safinamoideen",
  "customerPhoneNo": "919385452868",
  "instruction": "",
  "addressId": "6a5074361d5a14c9230a618a",
  "orderId": "20260703153155004569",
  "outletId": "6a47361e1898af1200d559e1"
}
```

---

### Response

```json
{
  "status": "failed",
  "message": "Order not found"
}
```

---

# API Test Report

### Purpose

This API is used to update an existing customer cart/order by modifying multiple products, quantities, variations, add-ons, and delivery details.

---

## Test Status

| Parameter        | Result |
| ---------------- | ------ |
| API Reachable    | ✅ Yes  |
| Request Method   | POST   |
| Request Accepted | ✅ Yes  |
| Cart Updated     | ❌ No   |
| Response Status  | Failed |

---

## Response Analysis

| Field   | Value           |
| ------- | --------------- |
| Status  | failed          |
| Message | Order not found |

---

## Observation

* The API endpoint is accessible.
* The request payload format is valid.
* Multiple products, variations, and add-ons were accepted in the request.
* The update operation failed because the specified `orderId` could not be found.

---

## Possible Causes

* Invalid or expired `orderId`.
* Order has already been completed, cancelled, or deleted.
* Order belongs to a different outlet.
* Order belongs to another organization.
* Attempting to update an old order instead of the active cart.

---

## Expected Behaviour

When a valid `orderId` is provided, the API should:

* Update all cart items.
* Modify product quantities.
* Update selected variations.
* Update add-ons.
* Recalculate taxes and totals.
* Save delivery information.
* Return the updated cart details.

---

## Frontend Handling

If this response is received, the frontend should:

* Show **"Order not found"** to the user.
* Refresh the cart using the **Get Cart Details** API.
* Create a new cart if no active order exists.
* Prevent checkout until a valid cart is available.

---

## Test Result

| Test Case          | Status   |
| ------------------ | -------- |
| Endpoint Reachable | ✅ Pass   |
| Request Validation | ✅ Pass   |
| Order Lookup       | ❌ Failed |
| Cart Update        | ❌ Failed |

---

## Conclusion

The **Update Cart** API endpoint is operational, but the update request failed because the supplied `orderId` does not exist or is no longer valid. The API correctly rejected the request and returned **"Order not found"**. Before calling this endpoint, the frontend should always obtain the latest active `orderId` from the **Get Cart Details** or **Create Cart** API to ensure successful cart updates.


# API 16 - Delete Cart Item

### Endpoint

```http
POST https://backend3.owct.me/cart/delete/item
```

---

### Request Body

```json
{
  "outletId": "6a47361e1898af1200d559e1",
  "orderId": "20260703153155004569",
  "itemid": "6a50779e7dff833360da9f8e",
  "customerPhoneNo": "919385452868",
  "customerName": "Safinamoideen"
}
```

---

### Response

```json
{
  "status": "failed",
  "message": "Order not found"
}
```

---

# API Test Report

### Purpose

This API is used to remove a specific item from an existing customer cart/order.

---

## Test Status

| Parameter       | Result  |
| --------------- | ------- |
| API Reachable   | ✅ Yes   |
| Request Method  | POST    |
| Request Format  | ✅ Valid |
| Item Deleted    | ❌ No    |
| Response Status | Failed  |

---

## Response Analysis

| Field   | Value           |
| ------- | --------------- |
| Status  | failed          |
| Message | Order not found |

---

## Observation

* The API endpoint is accessible.
* The request structure is valid.
* The server could not locate the specified order.
* Since the order was not found, the requested cart item was not deleted.

---

## Possible Causes

* Invalid or expired `orderId`.
* The order has already been completed, cancelled, or removed.
* The order belongs to a different outlet or organization.
* The provided `itemid` does not belong to the specified order.
* An outdated order reference was used.

---

## Expected Behaviour

When a valid order exists, the API should:

* Locate the specified order.
* Remove the selected cart item.
* Recalculate the cart total.
* Return the updated cart details.
* Respond with a success status.

---

## Frontend Handling

If this response is received, the frontend should:

* Display **"Order not found. Please refresh your cart and try again."**
* Fetch the latest active cart using the **Get Cart Details** API.
* Disable delete actions if no active cart exists.
* Prompt the user to create a new cart if necessary.

---

## Test Result

| Test Case          | Status   |
| ------------------ | -------- |
| Endpoint Reachable | ✅ Pass   |
| Request Validation | ✅ Pass   |
| Order Lookup       | ❌ Failed |
| Item Deletion      | ❌ Failed |

---

## Conclusion

The **Delete Cart Item** API endpoint is operational, but the delete operation failed because the specified **orderId** could not be found. As a result, no cart item was removed. The frontend should always retrieve the latest active **orderId** before attempting to delete items from the cart.


# API 17 - Update Cart (Special Instructions & Multiple Items)

### Endpoint

```http
POST https://backend3.owct.me/cart/update
```

---

### Request Body

```json
{
  "orderId": "20260703153155004569",
  "outletId": "6a47361e1898af1200d559e1",
  "customerPhoneNo": "919385452868",
  "customerName": "Safinamoideen",
  "deliveryType": "Door Delivery",
  "orderType": "Door Delivery",
  "items": [
    {
      "itemId": "6a47375233486b0991ac17fe",
      "quantity": 1,
      "variationId": "",
      "addOnDetails": [
        {
          "group_id": "6a47374e33486b0991abfcfc",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924af"
          ]
        }
      ],
      "currency": "INR"
    },
    {
      "itemId": "6a47375233486b0991ac18a3",
      "quantity": 1,
      "variationId": "6a473752a22b80a9bdd92c20",
      "addOnDetails": [
        {
          "group_id": "6a47374e33486b0991abfcdb",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924a0"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfce6",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924a5",
            "6a47374ea22b80a9bdd924a6",
            "6a47374ea22b80a9bdd924a7",
            "6a47374ea22b80a9bdd924a4"
          ]
        }
      ],
      "currency": "INR"
    },
    {
      "itemId": "6a47375233486b0991ac18a3",
      "quantity": 1,
      "variationId": "6a473752a22b80a9bdd92c20",
      "addOnDetails": [
        {
          "group_id": "6a47374e33486b0991abfcc1",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd92490"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfccf",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd92499"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfcdb",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd9249f"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfce6",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924a4",
            "6a47374ea22b80a9bdd924a5"
          ]
        }
      ],
      "currency": "INR"
    }
  ],
  "instruction": "special instruc",
  "addressId": "6a5074361d5a14c9230a618a"
}
```

---

### Response

```json
{
  "status": "failed",
  "message": "Order not found"
}
```

---

# API Test Report

### Purpose

This API is intended to update an existing cart by modifying multiple products, selected variations, add-ons, delivery information, customer details, and order instructions.

---

## Test Status

| Parameter       | Result  |
| --------------- | ------- |
| API Reachable   | ✅ Yes   |
| HTTP Method     | POST    |
| Request Format  | ✅ Valid |
| Cart Updated    | ❌ No    |
| Response Status | Failed  |

---

## Response Analysis

| Field   | Value           |
| ------- | --------------- |
| Status  | failed          |
| Message | Order not found |

---

## Observation

* The API endpoint is accessible.
* The request payload structure is valid.
* The API accepted the request but could not locate the specified order.
* No updates were applied to the cart.

---

## Possible Causes

* Invalid or expired `orderId`.
* The order has already been completed, cancelled, or deleted.
* The order belongs to a different outlet or organization.
* The supplied `orderId` is no longer active.
* The request references an outdated cart.

---

## Expected Behaviour

When a valid active order exists, the API should:

* Update all cart items.
* Modify quantities.
* Update product variations.
* Update add-on selections.
* Save customer instructions.
* Update delivery and address details.
* Recalculate taxes and totals.
* Return the updated cart information.

---

## Frontend Handling

If this response is received, the frontend should:

* Display **"Order not found. Please refresh your cart and try again."**
* Fetch the latest active cart using the **Get Cart Details** API.
* Obtain a valid active `orderId` before attempting another update.
* Prevent checkout or further cart modifications until a valid cart is available.

---

## Test Result

| Test Case          | Status   |
| ------------------ | -------- |
| Endpoint Reachable | ✅ Pass   |
| Request Validation | ✅ Pass   |
| Order Lookup       | ❌ Failed |
| Cart Update        | ❌ Failed |

---

## Conclusion

The **Update Cart** API is reachable and accepts the request format, but the update operation failed because the specified **orderId** could not be found. As a result, no cart changes were applied. The frontend should always retrieve the latest active `orderId` from the **Get Cart Details** or **Create Cart** API before invoking the **Update Cart** endpoint.






# API 18- Update Cart (Self Pickup)

### Endpoint

```http
POST https://backend3.owct.me/cart/update
```

---

### Request Body

```json
{
  "orderId": "20260703153155004569",
  "outletId": "6a47361e1898af1200d559e1",
  "customerPhoneNo": "919385452868",
  "customerName": "Safinamoideen",
  "deliveryType": "Self Pickup",
  "orderType": "Self Pickup",
  "items": [
    {
      "itemId": "6a47375233486b0991ac17fe",
      "quantity": 1,
      "variationId": "",
      "addOnDetails": [
        {
          "group_id": "6a47374e33486b0991abfcfc",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924af"
          ]
        }
      ],
      "currency": "INR"
    },
    {
      "itemId": "6a47375233486b0991ac18a3",
      "quantity": 1,
      "variationId": "6a473752a22b80a9bdd92c20",
      "addOnDetails": [
        {
          "group_id": "6a47374e33486b0991abfcdb",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924a0"
          ]
        },
        {
          "group_id": "6a47374e33486b0991abfce6",
          "addon_item_ids": [
            "6a47374ea22b80a9bdd924a5"
          ]
        }
      ],
      "currency": "INR"
    }
  ]
}
```

---

### Response

```json
{
  "status": "failed",
  "message": "Order not found"
}
```

---

# API Test Report

### Purpose

This API is used to update an existing cart for **Self Pickup**, including cart items, variations, add-ons, and order details.

---

## Test Status

| Parameter        | Result                    |
| ---------------- | ------------------------- |
| API Endpoint     | ✅ Reachable               |
| HTTP Method      | POST                      |
| Request Format   | ✅ Valid                   |
| Server Response  | ❌ Failed                  |
| HTTP Status      | 500 Internal Server Error |
| Response Message | Order not found           |

---

## Response Analysis

| Field   | Value           |
| ------- | --------------- |
| Status  | failed          |
| Message | Order not found |

---

## Observation

* The API endpoint is accessible.
* The request payload format is valid.
* The server returned **HTTP 500 (Internal Server Error)**.
* The response body indicates **"Order not found"**.
* No cart updates were performed.

---

## Possible Causes

* Invalid or expired `orderId`.
* The referenced order no longer exists.
* The order belongs to a different outlet or organization.
* The order has already been completed or deleted.
* The backend is incorrectly returning **HTTP 500** for a business validation error instead of an appropriate client error (such as 404 or 400).

---

## Expected Behaviour

For a valid order, the API should:

* Update cart items.
* Update delivery type to **Self Pickup**.
* Save product variations and add-ons.
* Recalculate totals.
* Return the updated cart details.

If the order does not exist, the API should return an appropriate client error (e.g., **404 Not Found**) rather than **500 Internal Server Error**.

---

## Frontend Handling

The frontend should:

* Display **"Order not found. Please refresh your cart and try again."**
* Retrieve the latest active cart using the **Get Cart Details** API.
* Create a new cart if no active order exists.
* Prevent further update attempts until a valid `orderId` is available.

---

## Test Result

| Test Case            | Status                                             |
| -------------------- | -------------------------------------------------- |
| Endpoint Reachable   | ✅ Pass                                             |
| Request Validation   | ✅ Pass                                             |
| Order Lookup         | ❌ Failed                                           |
| Cart Update          | ❌ Failed                                           |
| HTTP Status Handling | ⚠️ Backend Issue (500 returned for business error) |

---

# Conclusion

The **Update Cart (Self Pickup)** API is reachable and accepts the request payload, but the update operation failed because the specified **orderId** could not be found. Additionally, the backend returned **HTTP 500 Internal Server Error** while the actual response indicates a business validation error (`Order not found`). This suggests that the backend's HTTP status code handling should be reviewed. Before invoking this API, the frontend should always retrieve a valid active `orderId` from the **Get Cart Details** or **Create Cart** API.


PRODUCT 
# API 18 - Get Categories

### Endpoint

```http
POST https://backend3.owct.me/category/getCategory
```

---

### Request Body

```json
{
  "outletId": "6a47361e1898af1200d559e1",
  "belongsTo": "685670e4486951278738864e",
  "customerId": "69c79aff6d0f297e92fec96d"
}
```

---

### Response

```json
{
  "status": "success",
  "data": [
    {
      "_id": "6a47374e33486b0991abfd29",
      "name": "Fresh Fillet Burgers",
      "imageUrl": "https://storage.googleapis.com/ownchat/uploads/images/common_image.jpg",
      "categoryTimings": [],
      "items": [
        {
          "_id": "6a47374f33486b0991abfeee",
          "active": true,
          "allowAddon": true,
          "allowVariation": false
        }
      ]
    }
  ]
}
```

---

# API Test Report

### Purpose

This API retrieves all available product categories along with their associated products for a selected outlet.

---

## Test Status

| Parameter          | Result      |
| ------------------ | ----------- |
| API Endpoint       | ✅ Reachable |
| HTTP Method        | POST        |
| Request Validation | ✅ Passed    |
| HTTP Status        | ✅ 200 OK    |
| Response Status    | ✅ Success   |

---

## Response Analysis

| Field               | Value   |
| ------------------- | ------- |
| Status              | success |
| Categories Returned | Yes     |
| Products Returned   | Yes     |

---

## Data Retrieved

The API successfully returned:

* Product categories
* Category images
* Category timing information
* Product list under each category
* Product active status
* Add-on availability
* Product variation availability

---

## Sample Category

| Field            | Value                   |
| ---------------- | ----------------------- |
| Category Name    | Fresh Fillet Burgers    |
| Image            | Available               |
| Products         | Available               |
| Category Timings | Empty (No restrictions) |

---

## Sample Product

| Field                | Value     |
| -------------------- | --------- |
| Product ID           | Available |
| Active               | Yes       |
| Add-ons Supported    | Yes       |
| Variations Supported | No        |

---

## Expected Behaviour

The API should:

* Return all available product categories.
* Return products grouped under each category.
* Include category images.
* Include product availability information.
* Include add-on and variation support.
* Return only active categories and products.

---

## Frontend Usage

The frontend can use this API to:

* Display category tabs.
* Display products under each category.
* Show category images.
* Show or hide add-on selection.
* Show variation options based on product configuration.
* Build the complete product listing page.

---

## Test Result

| Test Case           | Status |
| ------------------- | ------ |
| Endpoint Reachable  | ✅ Pass |
| Category Retrieval  | ✅ Pass |
| Product Retrieval   | ✅ Pass |
| Response Validation | ✅ Pass |

---

# Conclusion

The **Get Categories** API is working correctly. It successfully returns the list of product categories along with their associated products, images, and product configuration details (such as add-ons and variations). The API is ready to be integrated into the frontend for rendering category navigation and product listings.


# API 19 - Get Item Details

### Endpoint

```http
POST https://backend3.owct.me/item/getItemDetail
```

---

### Request Body

```json
{
  "itemId": "6a47374f33486b0991abfeee",
  "outletId": "6a47361e1898af1200d559e1"
}
```

---

### Response

```json
{
  "status": "success",
  "data": {
    "itemid": "6a47374f33486b0991abfeee",
    "itemname": "Cheese Burst Veg Burger",
    "variationid": null,
    "dietryType": "veg",
    "basePrice": 359,
    "sellingPrice": 259,
    "image": [
      "https://storage.googleapis.com/ownchat/uploads/images/common_image.jpg"
    ],
    "variations": [],
    "addons": [
      {
        "...": "Add-on details"
      }
    ]
  }
}
```

---

# API Test Report

### Purpose

This API retrieves the complete details of a selected product, including pricing, images, variations, and available add-ons.

---

## Test Status

| Parameter          | Result      |
| ------------------ | ----------- |
| API Endpoint       | ✅ Reachable |
| HTTP Method        | POST        |
| Request Validation | ✅ Passed    |
| HTTP Status        | ✅ 200 OK    |
| Response Status    | ✅ Success   |

---

## Response Analysis

| Field         | Value     |
| ------------- | --------- |
| Status        | success   |
| Item Details  | Available |
| Product Image | Available |
| Pricing       | Available |
| Add-ons       | Available |
| Variations    | None      |

---

## Product Details Retrieved

| Field         | Value                   |
| ------------- | ----------------------- |
| Product Name  | Cheese Burst Veg Burger |
| Product Type  | Veg                     |
| Base Price    | ₹359                    |
| Selling Price | ₹259                    |
| Discount      | ₹100                    |
| Product Image | Available               |
| Variations    | Not Available           |
| Add-ons       | Available               |

---

## Data Returned

The API successfully returns:

* Product ID
* Product name
* Dietary type (Veg/Non-Veg)
* Base price
* Selling price
* Product images
* Available variations
* Available add-ons

---

## Expected Behaviour

The API should:

* Return complete product details.
* Return the latest product price.
* Return product images.
* Return available add-ons.
* Return variation details if applicable.
* Return an empty variation list when variations are not available.

---

## Frontend Usage

The frontend can use this API to:

* Display the Product Detail page.
* Show product images.
* Display selling and original prices.
* Show Veg/Non-Veg indicator.
* Display available add-ons.
* Display variation selection (if available).
* Enable the Add to Cart action.

---

## Test Result

| Test Case                 | Status              |
| ------------------------- | ------------------- |
| Endpoint Reachable        | ✅ Pass              |
| Product Details Retrieved | ✅ Pass              |
| Pricing Retrieved         | ✅ Pass              |
| Image Retrieved           | ✅ Pass              |
| Add-ons Retrieved         | ✅ Pass              |
| Variations Retrieved      | ✅ Pass (Empty List) |

---

# Conclusion

The **Get Item Detail** API is functioning correctly. It successfully returns complete product information, including pricing, dietary type, product images, and available add-ons. In this test case, no product variations were available, which is correctly represented by an empty `variations` array. The API is ready for integration with the product details page in the frontend.


# API 20 - Get Item Details (With Variation)

### Endpoint

```http
POST https://backend3.owct.me/item/getItemDetail
```

---

### Request Body

```json
{
  "itemId": "6a47375233486b0991ac18dc",
  "variationid": "6a473752a22b80a9bdd92c4a",
  "outletId": "6a47361e1898af1200d559e1"
}
```

---

### Response

```json
{
  "status": "success",
  "data": {
    "itemid": "6a47375233486b0991ac18dc",
    "itemname": "Smoky Tandoor Infused Chicken",
    "variationid": "6a473752a22b80a9bdd92c4a",
    "dietryType": "non-veg",
    "basePrice": 859,
    "sellingPrice": 759,
    "image": [
      "https://storage.googleapis.com/ownchat/uploads/images/common_image.jpg"
    ],
    "variations": [
      {
        "name": "Half"
      }
    ],
    "addons": [
      {
        "...": "Add-on details"
      }
    ]
  }
}
```

---

# API Test Report

### Purpose

This API retrieves detailed information for a specific product variation, including pricing, images, available variations, and add-ons.

---

## Test Status

| Parameter          | Result      |
| ------------------ | ----------- |
| API Endpoint       | ✅ Reachable |
| HTTP Method        | POST        |
| Request Validation | ✅ Passed    |
| HTTP Status        | ✅ 200 OK    |
| Response Status    | ✅ Success   |

---

## Response Analysis

| Field             | Value     |
| ----------------- | --------- |
| Status            | success   |
| Product Details   | Available |
| Product Variation | Available |
| Product Image     | Available |
| Add-ons           | Available |

---

## Product Details Retrieved

| Field              | Value                         |
| ------------------ | ----------------------------- |
| Product Name       | Smoky Tandoor Infused Chicken |
| Dietary Type       | Non-Veg                       |
| Selected Variation | Half                          |
| Base Price         | ₹859                          |
| Selling Price      | ₹759                          |
| Discount           | ₹100                          |
| Product Image      | Available                     |
| Add-ons            | Available                     |

---

## Data Returned

The API successfully returns:

* Product ID
* Product name
* Selected variation
* Dietary type (Veg/Non-Veg)
* Base price
* Selling price
* Product image
* Available product variations
* Available add-ons

---

## Expected Behaviour

The API should:

* Return complete product details.
* Return details for the selected variation.
* Return updated pricing based on the selected variation.
* Return available add-ons.
* Return product images.
* Return all available variations for user selection.

---

## Frontend Usage

The frontend can use this API to:

* Display the Product Detail page.
* Show the selected product variation.
* Display product images.
* Show Veg/Non-Veg badge.
* Display original and discounted prices.
* Allow users to switch between available variations.
* Display available add-ons.
* Enable the **Add to Cart** functionality.

---

## Test Result

| Test Case                 | Status |
| ------------------------- | ------ |
| Endpoint Reachable        | ✅ Pass |
| Product Details Retrieved | ✅ Pass |
| Variation Retrieved       | ✅ Pass |
| Pricing Retrieved         | ✅ Pass |
| Image Retrieved           | ✅ Pass |
| Add-ons Retrieved         | ✅ Pass |

---

# Conclusion

The **Get Item Detail (With Variation)** API is functioning correctly. It successfully returns detailed information for the selected product variation, including variation-specific pricing, dietary type, images, available variations, and add-ons. The API is suitable for powering the Product Details page and supporting variation selection before adding items to the cart.



# API 21 - Get User Discounts

### Endpoint

```http
POST https://backend3.owct.me/discount/get-user-discounts
```

---

### Request Body

```json
{
  "outletId": "6a47361e1898af1200d559e1"
}
```

---

### Response

```json
{
  "status": "success",
  "data": [
    {
      "_id": "6a22699a6ed026254f5ef06c",
      "name": "Click & Avail 10% Discount",
      "discountType": "free_shipping",
      "value": {},
      "applicationType": "all",
      "calculationType": "total",
      "endDate": "2027-07-30T18:29:59.000Z",
      "endTime": "23:00",
      "image": "",
      "offerIcon": "ticket",
      "eligible": false
    }
  ]
}
```

---

# API Test Report

### Purpose

This API retrieves all discounts and promotional offers available for the selected outlet, along with customer eligibility information.

---

## Test Status

| Parameter          | Result      |
| ------------------ | ----------- |
| API Endpoint       | ✅ Reachable |
| HTTP Method        | POST        |
| Request Validation | ✅ Passed    |
| HTTP Status        | ✅ 200 OK    |
| Response Status    | ✅ Success   |

---

## Response Analysis

| Field              | Value     |
| ------------------ | --------- |
| Status             | success   |
| Discounts Returned | Yes       |
| Eligibility Status | Available |

---

## Discount Details Retrieved

| Field            | Value                      |
| ---------------- | -------------------------- |
| Offer Name       | Click & Avail 10% Discount |
| Discount Type    | Free Shipping              |
| Application Type | All Products               |
| Calculation Type | Total Order                |
| Offer Icon       | Ticket                     |
| End Date         | 30-Jul-2027                |
| End Time         | 23:00                      |
| Eligible         | No                         |

---

## Data Returned

The API successfully returns:

* Discount ID
* Offer name
* Discount type
* Application type
* Calculation type
* Offer validity
* Offer icon
* Eligibility status
* Discount value (if applicable)

---

## Expected Behaviour

The API should:

* Return all active discounts for the outlet.
* Return customer eligibility for each discount.
* Return discount validity period.
* Return discount calculation details.
* Exclude expired or inactive offers.

---

## Frontend Usage

The frontend can use this API to:

* Display available offers on the home page.
* Show coupon and discount cards.
* Display shipping offers.
* Indicate whether the customer is eligible for a discount.
* Filter eligible and ineligible offers.
* Apply selected discounts during checkout (subject to eligibility).

---

## Test Result

| Test Case                    | Status |
| ---------------------------- | ------ |
| Endpoint Reachable           | ✅ Pass |
| Discount Retrieval           | ✅ Pass |
| Eligibility Status Retrieved | ✅ Pass |
| Response Validation          | ✅ Pass |

---

# Conclusion

The **Get User Discounts** API is functioning correctly. It successfully returns the list of active discounts and promotional offers available for the selected outlet, including offer details, validity period, and customer eligibility status. In this test, the offer **"Click & Avail 10% Discount"** was returned, but the customer was **not eligible** (`eligible: false`). The API is ready for integration with the offers, coupons, and checkout modules in the frontend.





### API Test Report

| API                            | Method | Status | Result                               | Remarks                       |
| ------------------------------ | ------ | ------ | ------------------------------------ | ----------------------------- |
| `/discount/get-user-discounts` | POST   | ✅ Pass | Discount list retrieved successfully | Working as expected.          |
| `/discount/applyToCart`        | POST   | ❌ Fail | **400 Bad Request**                  | **Message:** `Cart not found` |

### Tested Request

```json
{
  "outletId": "6a47361e1898af1200d559e1",
  "code": "",
  "orderId": "20260703153155004569",
  "discountId": "6a473c8da22b80a9bdd93043"
}
```

### Response

```json
{
  "status": "failed",
  "message": "Cart not found"
}
```

### Observation

* Discount retrieval API is functioning correctly.
* Applying a discount failed because the backend could not locate the specified cart/order.
* The provided `orderId` appears to be invalid, expired, or no longer available in the active cart.

### Recommendation

* Verify that the `orderId` belongs to an active cart.
* Retry using the latest order created from the `cart/create` API before applying the discount.
* Confirm with the backend team whether the API accepts only active **cart order IDs** and not completed/expired orders.


### API Test Report

| API                  | Method | Status | Result                                    | Remarks                  |
| -------------------- | ------ | ------ | ----------------------------------------- | ------------------------ |
| `/banner/get-active` | POST   | ✅ Pass | Active banner list retrieved successfully | API working as expected. |

### Tested Request

```json
{
  "outletId": "68e50210e60db7f4187e031e",
  "belongsTo": "685670e4486951278738864e"
}
```

### Response Summary

* Status: **success**
* Active banners returned successfully.
* Response includes:

  * Banner ID
  * Banner Type (`item`)
  * Outlet ID
  * Organization ID
  * Linked Item ID(s)
  * Active Status
  * Mobile Banner Image URL

### Observation

* API is functioning correctly.
* Banner data is returned without authentication or validation issues.
* Returned data is sufficient for displaying promotional banners on the Home screen.

### Frontend Usage

* Call this API after outlet selection.
* Display banners using the `image.mobileView` URL.
* Clicking the banner should navigate to the associated product (`item`) if applicable.

**Overall Status:** ✅ **PASS**
