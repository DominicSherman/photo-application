import React, {Component} from 'react';
import {FlatList, Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {withRedux} from '../redux-factory';
import {darkFontStyles} from '../constants/font-styles';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import TouchableImage from '../components/TouchableImage';

class Images extends Component {
    _renderRow(images) {
        const Images = () => images.map((item, index) =>
            <TouchableImage
                key={index}
                item={item}
                index={index}
            />
        );

        return (
            <View style={{flexDirection: 'row'}}>
                <Images/>
            </View>
        );
    };

    render() {
        return (
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={this.props.modalVisible}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <Text style={darkFontStyles.regular}>{'Select Photos to Upload'}</Text>
                        <Touchable
                            onPress={() => this.props.actions.setModalVisible(false)}
                        >
                            <EvilIcon
                                name={'close'}
                                size={30}
                            />
                        </Touchable>
                    </View>
                    <FlatList
                        data={this.props.cameraRollRows}
                        keyExtractor={(item) => item[0].node.image.uri}
                        renderItem={({item}) => this._renderRow(item)}
                    />
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignContent: 'center'
    }
});

export default withRedux(Images);