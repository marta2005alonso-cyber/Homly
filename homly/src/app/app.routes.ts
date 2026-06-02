import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ListProperties } from './components/list-properties/list-properties';
import { Profile } from './components/profile/profile';
import { PropertyDetail } from './components/property-detail/property-detail';
import { Bookings } from './components/bookings/bookings';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard } from './savedUsers/auth-guard';
import { PropertyForm } from './components/property-form/property-form';
import { MyProperties } from './components/my-properties/my-properties';
import { PropertyBookings } from './components/property-bookings/property-bookings';
import { PropertyRequests } from './components/property-requests/property-requests';
import { BookingForm } from './components/booking-form/booking-form';
import { ReviewForm } from './components/review-form/review-form';
import { Favorites } from './components/favorites/favorites';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'listProperties', component: ListProperties },
    { path: 'property/:id', component: PropertyDetail },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: 'bookings', component: Bookings, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'property-form/:id', component: PropertyForm, canActivate: [authGuard] },
    { path: 'my-properties', component: MyProperties, canActivate: [authGuard] },
    { path: 'property-bookings/:id', component: PropertyBookings, canActivate: [authGuard] },
    { path: 'property-requests/:id', component: PropertyRequests, canActivate: [authGuard] },
    { path: 'booking-form/:id', component: BookingForm, canActivate: [authGuard] },
    { path: 'review-form/:bookingId', component: ReviewForm, canActivate: [authGuard] },
    { path: 'favorites', component: Favorites, canActivate: [authGuard] },
    { path: 'admin', component: Admin, canActivate: [authGuard] },
];