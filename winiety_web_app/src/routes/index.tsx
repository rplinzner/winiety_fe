import React, { ReactElement, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthRoute from 'components/AuthRoute';
import {
  arrayBufferToBase64,
  displayNotification,
  getSubscription,
  subscribeUser,
} from 'utils';
import { useStoreState } from 'store';
import { NotificationRepository } from 'api/repository';
import Home from './Home';
import NotFound from './NotFound';
import SigninOidc from './SignInOidc';
import SignoutOidc from './SignOutOidc';
import Rides from './Rides';
import Fines from './Fines';
import Offenses from './Offenses';
import UserProfile from './UserProfile/UserProfile';
import UserFinesComplaints from './UserFinesComplaints';
import Complaints from './Complaints';
import Errors from './Errors';
import StatisticsFiles from './StatisticsFiles';
import UserPayments from './UserPayments';
import UserVignettes from './UserVignettes';
import Statistics from './Statistics';

export const appRoutes = {
  home: '/',
  signIn: '/sign-in',
  signOut: '/sign-out',
  rides: '/rides',
  userFinesComplaints: '/fines-complaints',
  fines: '/fines',
  offenses: '/offenses',
  userProfile: '/profile',
  complaints: '/complaints',
  errors: '/errors',
  statisticsFiles: '/statistics/files',
  UserPayments: '/payments',
  UserVignettes: '/vignettes',
  statistics: '/statistics',
};

const onError = () =>
  displayNotification('Błąd', 'Wystąpił błąd podczas łączeniem z serwerem');

export const RoutedContent = (): ReactElement => {
  const isAuthenticated = useStoreState(
    (state) => state.userSession.isAuthenticated
  );

  const getKey = NotificationRepository.useGetKeyLazy();
  const postSubscription = NotificationRepository.usePostNotificationSubscription(
    onError
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    const inner = async () => {
      let sub: PushSubscription | null | undefined = await getSubscription();
      if (!sub) {
        const key = await getKey();
        if (!key) {
          onError();
          return;
        }
        sub = await subscribeUser(key);
      }
      if (!sub) {
        displayNotification(
          'Błąd',
          'Wystąpił błąd podczas subskrypcji notyfikacji. Spróbuj przeładować stronę'
        );
        return;
      }
      await postSubscription({
        endpoint: sub.endpoint,
        p256dh: arrayBufferToBase64(sub.getKey('p256dh')),
        auth: arrayBufferToBase64(sub.getKey('auth')),
      });
    };
    inner();
  }, [getKey, isAuthenticated, postSubscription]);

  return (
    <Switch>
      <Route path={appRoutes.signIn} component={SigninOidc} />
      <Route path={appRoutes.signOut} component={SignoutOidc} />
      <Route path={appRoutes.home} exact component={Home} />
      <AuthRoute
        path={appRoutes.rides}
        Component={Rides}
        requiredRoles={['user', 'admin']}
      />
      <AuthRoute
        path={appRoutes.userProfile}
        Component={UserProfile}
        requiredRoles={['user', 'admin']}
      />
      <AuthRoute
        path={appRoutes.userFinesComplaints}
        Component={UserFinesComplaints}
        requiredRoles={['user', 'admin']}
      />
      <AuthRoute
        path={appRoutes.UserPayments}
        Component={UserPayments}
        requiredRoles={['user', 'admin']}
      />
      <AuthRoute
        path={appRoutes.UserVignettes}
        Component={UserVignettes}
        requiredRoles={['user', 'admin']}
      />
      <AuthRoute
        path={appRoutes.fines}
        Component={Fines}
        requiredRoles={['police', 'admin']}
      />
      <AuthRoute
        path={appRoutes.offenses}
        Component={Offenses}
        requiredRoles={['police', 'admin']}
      />
      <AuthRoute
        path={appRoutes.complaints}
        Component={Complaints}
        requiredRoles={['corrector', 'admin']}
      />
      <AuthRoute
        path={appRoutes.errors}
        Component={Errors}
        requiredRoles={['corrector', 'admin']}
      />
      <AuthRoute
        path={appRoutes.statisticsFiles}
        Component={StatisticsFiles}
        requiredRoles={['analyst', 'admin']}
      />
      <AuthRoute
        path={appRoutes.statistics}
        Component={Statistics}
        requiredRoles={['analyst', 'admin']}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default appRoutes;
