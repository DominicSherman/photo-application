import React, {Component} from 'react';
import {CameraRoll} from 'react-native';

import {numPictures} from './constants/variables';
import Home from './screens/Home';
import LoadingView from './screens/LoadingView';

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
            isUploading,
            selectedImages,
            user
        } = this.props;

        if (isUploading) {
            return (
                <LoadingView {...this.props} />
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
