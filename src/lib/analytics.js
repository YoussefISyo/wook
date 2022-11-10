import firebase from 'react-native-firebase';
import {getUser} from 'Wook_Market/src/lib/user';


async function setUser() {
  var user = await getUser();
  firebase.analytics().setUserId(''+user.id);
  firebase.analytics().setUserProperties({
    email: user.email,
  });
  console.log('Analytics user set');
}

function event(name, data = {}) {
  

  try {
    firebase.analytics().logEvent(name, data);
    console.log('Analytics event', name);
  } catch (e) {
    console.log('Unable to tag analytics event:', e);
  }
}

function screen(name, data = {}) {
  firebase.analytics().logEvent(name, data);
  console.log('Analytics screen', name);
}

global.Analytics = {setUser, event, screen};

export default {setUser, event, screen};