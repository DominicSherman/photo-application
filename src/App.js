import React, {Component} from 'react';
import {withRedux} from './redux-factory';
import {numPictures} from './constants/variables';
import {initializeFirebase} from './services/firebase-service';
import {CameraRoll} from 'react-native';
import {SHOULD_AUTHENTICATE} from '../config';
import Home from './screens/Home';
import Login from './screens/Login';
import LoadingView from './screens/LoadingView';
import UserModal from './screens/UserModal';
import ImageSelectModal from './screens/ImageSelectModal';

class App extends Component {
    componentWillMount() {
        initializeFirebase();
        this.props.actions.setUsers();
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'All',
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    render() {
        const {
            actions,
            cameraRollRows,
            selectedImages,
            imageModalVisible,
            user,
            users,
            userModalVisible
        } = this.props;

        if (this.props.isUploading || (SHOULD_AUTHENTICATE && !users)) {
            return <LoadingView/>;
        }

        if (userModalVisible) {
            return (
                <UserModal
                    actions={actions}
                    users={users}
                    userModalVisible={userModalVisible}
                />
            );
        }

        if (imageModalVisible) {
            return (
                <ImageSelectModal
                    actions={actions}
                    cameraRollRows={cameraRollRows}
                    selectedImages={selectedImages}
                    imageModalVisible={imageModalVisible}
                />
            );
        }

        if (!this.props.user.loggedIn && SHOULD_AUTHENTICATE) {
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
}

export default withRedux(App);