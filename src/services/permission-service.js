import {PermissionsAndroid} from 'react-native';

export const requestExternalStorage = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                'message': 'App needs access to external storage',
                'title': 'D&M Photos'
            }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
        return false;
    }
};
