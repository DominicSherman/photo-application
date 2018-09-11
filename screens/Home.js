import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {CameraRoll, FlatList, Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {withRedux} from '../redux-factory';
import {numPictures} from '../constants/variables';
import {darkFontStyles} from '../constants/font-styles';
import TouchableImage from '../components/TouchableImage';

class Home extends React.Component {
    state = {
        modalVisible: false
    };

    _renderRow(images) {
        const Images = () => images.map((item, index) =>
            <TouchableImage
                actions={this.props.actions}
                key={index}
                item={item}
                index={index}
                selectedImages={this.props.selectedImages}
            />
        );

        return (
            <View style={{flexDirection: 'row'}}>
                <Images/>
            </View>
        );
    };

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'Photos',
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    render() {
        const {cameraRollRows, selectedImages} = this.props;

        return (
            <View style={styles.wrapper}>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <SafeAreaView>
                        <View style={styles.header}>
                            <Text style={darkFontStyles.regular}>{'Select Photos to Upload'}</Text>
                            <Touchable
                                onPress={() => this.setState({modalVisible: false})}
                            >
                                <EvilIcons
                                    name={'close'}
                                    size={30}
                                />
                            </Touchable>
                        </View>
                        <FlatList
                            data={cameraRollRows}
                            extraData={selectedImages}
                            keyExtractor={(item) => item[0].timestamp}
                            renderItem={({item}) => this._renderRow(item)}
                        />
                    </SafeAreaView>
                </Modal>
                <Touchable
                    onPress={() => this.setState({modalVisible: true})}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignContent: 'center'
    },
    wrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    }
});

export default withRedux(Home);
