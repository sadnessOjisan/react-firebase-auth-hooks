# react-firebase-auth-hooks

This is patch for [react-firebase-hooks](https://github.com/csfrequency/react-firebase-hooks).

And only support for auth hooks.

```
$ npm i react-firebase-auth-hooks
```

```tsx
const [user, loading, error] = useAuthState(Firebase.instance.auth);

# user is firebase.User. success infer!
```
