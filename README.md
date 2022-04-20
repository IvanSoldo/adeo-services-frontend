# Adeo Services

This project was created using React and Material UI library.

## Description

User to reception interface and hotel management tool.

## Roles

There are two roles - Admin and receptionist.

## Features

### Dashboard main page

Both admin and receptionist can view total stats for Adeo services application on dashboard page. Stats include total order count, total completed orders, total
pending orders, total ocuring orders, total service offering, total rooms, total orders for today and total orders for this year.

### Hotel Rooms management

Admin can create, read, update, delete rooms and generate QR code for the specific room. 

Every room should have a QR code present. Upon QR code scan - user is navigated to user pages.

### Services management

Admin can create, read, update and delete services and service types. 

Every service has a service type and every service type has a list of services. For example, Bike #3 is a service, and its service type is Bike. 

### Menu management

Admin can create, read, update and delete menu and menu items.

Every menu item has a menu, and every menu has a list of menu items.

### Rent management

Admin and receptionist can create, read, update and delete rents.

Reading and deletion of rents can be handled after successfully navigating to rent history. Rents are displayed in a table with pagination, and there are options to 
navigate between all, completed, occurring and pending rents.

Creating and updating of rent can be done on rent tab. Two options are presented - Create new rent and Rents timesheet.

The form itself is similar to user rent form. Only difference is that an admin or receptionist must select the room number when 
creating new rent and there are no restriction on days and time.

Rent updating is done via Rents timesheet tab. There is no clasic update of specific rent. Instead, a graph of rents is displayed. Rents can be filtered per 
service type and selected date. Every rent is draggable. The idea behind this feature is that admin and receptionist can better optimize service distribution.

### Room service management

Admin and receptionst can read, update and delete room service orders.

All orders are displayed in a table with pagination, and there are options to navigate between all, processed and unprocessed orders. 
Difference between processed ond unprocessed orders is that processed one are known by the kitchen staff. 

Only update option is to swtich between is Processed field from false to true, and vise versa.

If there is a logged in user(admin or receptionist), a scheduler is run in the background. Mentioned scheduler returns unprocessed orders count. If there are 
unprocessed orders - Room Service tab turns red, room service icon is changed to exclamation mark and total unprocessed order count is displayed alongside tab text.

### User main page

Upon successful qr code scan - user is navigated to main page. Every user feature is presented to user on main page. 

### Localization

Localization is available in 4 languages - English, German, Italian and Croatian. Every feature on user pages is available in all 4 languages.

### User rent feature

User can navigate to rent feature from the main page. Pricing is displayed in the top section of the form. Form is displayed via stepper. 

**Steps include:**
 - Service type selection
 - wanted amount (1 - 4 is accepted range per hotelrequirements) 
 - date to place the order at (only today and tomorrow are viable for user) 
 - option to book for the whole day (if it is selected for the whole day - the two next steps are skipped)
 - from time. Rent orders cannot start in the past (i.e. if now is 11:10 AM, order cannot start from 10:00 AM. Minimum time to start is 11:00 AM)
 - to time. Minimum time to start is 1 hour more than from time.
 - final step where submit button is displayed, alongsise reset. If orders is successfully submited - dialog window is opened with back to menu button.

### Room service feature

User can navigate to room service feature from the main page. Room service is available from 12:00 to 17:45 and from 21:00 to 22:45. If user tries to enter the page 
while not within the time ranges, a dialog is prompted with message and back to menu button. 

If user enters the page while within one of the mentioned time ranges - every menu items is displayed and grouped by menu. User can add items to cart by clickin + button and remove them by clicking the - button. If total amount of items in cart is more than 1 , a checkout floating button is presented to user. In checkout page, user can also change the amount of the selected item. If user empties the cart - he is redirected to room service form. In checkout, user is presented with order button. If room service order is successful, a dialog is prompted with the success message and back to menu button. On every successful order cart is emptied. If user doesnt complete his order, items stay in the cart.

### Menu feature

This feature navigates user to pdf version of menu.

### Submit a hotel review feature

User can submit hotel reviews. If the rating is 4 or 5 stars - user is presented with option to share the review of hotel via facebook, twitter or linkedin. If the rating is below 4 stars - option to share the review are not presented.

### Call the reception

Upon call the reception menu button click - app responsible for calls is opened with the predefined number of the reception.

### House rules

This feature navigates user to house rules in pdf format.

### TV

This feature navigates user to tv channels and guide in pdf format.

### Phone manual

This feature navigates user to phone manual in pdf format.

### Maps

This feature navigates user to built in google maps page with custom interesting locations for user to visit. 

### Tourist train

This feature navigates user to tourist train schedule in pdf format.

### Call the TAXI

Upon call the the TAXI menu button click - app responsible for calls is opened with the predefined number of the taxi service.







