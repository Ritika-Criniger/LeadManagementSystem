import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = global.localStorage?.getItem?.('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [UserId, setId] = useState(() => {
    const savedId = global.localStorage?.getItem?.('UserId');
    return savedId ? JSON.parse(savedId) : null;
  });
  const [UserToken, setToken] = useState(() => {
    const savedToken = global.localStorage?.getItem?.('UserToken');
    return savedToken ? JSON.parse(savedToken) : null;
  });
  const [Arn, setArn] = useState(() => {
    const savedArn = global.localStorage?.getItem?.('Arn');
    return savedArn ? JSON.parse(savedArn) : null;
  });
  const [userRole, setRole] = useState(() => {
    const savedRole = global.localStorage?.getItem?.('userRole');
    return savedRole ? JSON.parse(savedRole) : null;
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && UserId && UserToken && Arn && userRole) {
      global.localStorage?.setItem?.('user', JSON.stringify(user));
      global.localStorage?.setItem?.('UserId', JSON.stringify(UserId));
      global.localStorage?.setItem?.('UserToken', JSON.stringify(UserToken));
      global.localStorage?.setItem?.('Arn', JSON.stringify(Arn));
      global.localStorage?.setItem?.('userRole', JSON.stringify(userRole));
    } else {
      global.localStorage?.removeItem?.('user');
      global.localStorage?.removeItem?.('UserId');
      global.localStorage?.removeItem?.('UserToken');
      global.localStorage?.removeItem?.('Arn');
      global.localStorage?.removeItem?.('selectedDate');
      global.localStorage?.removeItem?.('clientsData');
      global.localStorage?.removeItem?.('userRole');
    }
  }, [user, UserId, UserToken, Arn, userRole]);

  const logout = () => {
    global.localStorage?.removeItem?.('UserToken');
    global.localStorage?.removeItem?.('user');
    global.localStorage?.removeItem?.('UserId');
    global.localStorage?.removeItem?.('selectedDate');
    global.localStorage?.removeItem?.('Arn');
    global.localStorage?.removeItem?.('clientsData');
    global.localStorage?.removeItem?.('userRole');
    setUser(null);
    setId(null);
    setToken(null);
    setArn(null);
    setRole(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, UserId, setId, UserToken, setToken, Arn, setArn, userRole, setRole, notifications, setNotifications }}>
      {children}
    </UserContext.Provider>
  );
};