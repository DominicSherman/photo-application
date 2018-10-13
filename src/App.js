import React, {Component} from 'react';
import {CameraRoll} from 'react-native';

import {withRedux} from './redux-factory';
import {numPictures} from './constants/variables';
import {initializeFirebase} from './services/firebase-service';
import Home from './screens/Home';
import Login from './screens/Login';
import LoadingView from './screens/LoadingView';
import UserModal from './screens/UserModal';
import ImageSelectModal from './screens/ImageSelectModal';
import {tryToLoadCredentials} from './services/async-storage-service';

class App extends Component {
    componentWillMount() {
        tryToLoadCredentials(this.props.actions);
        initializeFirebase();
        this.props.actions.setUsers();
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            assetType: 'All',
            first: numPictures
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    /* eslint-disable complexity */
    render() {
        const {
            actions,
            cameraRollRows,
            imageModalVisible,
            isUploading,
            selectedImages,
            shouldAuthenticate,
            user,
            userModalVisible,
            users
        } = this.props;

        if (isUploading || !user.loggedIn && !users && shouldAuthenticate) {
            return (
                <LoadingView {...this.props} />
            );
        }

        if (userModalVisible) {
            return (
                <UserModal
                    actions={actions}
                    userModalVisible={userModalVisible}
                    users={users}
                />
            );
        }

        if (imageModalVisible) {
            return (
                <ImageSelectModal
                    actions={actions}
                    cameraRollRows={cameraRollRows}
                    imageModalVisible={imageModalVisible}
                    selectedImages={selectedImages}
                />
            );
        }

        if (!this.props.user.loggedIn && shouldAuthenticate) {
            return (
                <Login
                    actions={actions}
                    user={user}
                    users={users}
                />
            );
        }

        return (
            <Home
                actions={actions}
                selectedImages={selectedImages}
                user={user}
            />
        );
    }
    /* eslint-enable complexity */
}

export default withRedux(App);
