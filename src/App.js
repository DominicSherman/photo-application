import React, {Component} from 'react';
import {CameraRoll} from 'react-native';

import {numPictures} from './constants/variables';
import Home from './screens/Home';
import LoadingView from './screens/LoadingView';
import UserModal from './screens/UserModal';
import ImageSelectModal from './screens/ImageSelectModal';

export default class App extends Component {
    componentWillMount() {
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
