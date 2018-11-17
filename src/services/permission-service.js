import {PermissionsAndroid} from 'react-native';

export const requestExternalStorage = async () => {
    let granted = null;

    try {
        granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                'message': 'App needs access to external storage',
                'title': 'D&M Photos'
            }
        );
    } catch (error) {
        console.log('ERROR', error);
    }

    return granted === PermissionsAndroid.RESULTS.GRANTED;
};
