import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {CameraRoll, Dimensions, StyleSheet, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Images from './Images';
import {withRedux} from '../redux-factory';
import {numPictures} from '../constants/variables';

class Home extends React.Component {
    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'Photos',
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Images/>
                <Touchable
                    onPress={() => this.props.actions.setModalVisible(true)}
                >
                    <Entypo
                        size={40}
                        name={'circle-with-plus'}
                    />
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    }
});

export default withRedux(Home);
