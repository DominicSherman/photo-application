import React, {Component} from 'react';
import {darkFontStyles} from '../constants/font-styles';
import {FlatList, Modal, SafeAreaView, Text, View, StyleSheet} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import TouchableImage from '../components/TouchableImage';
import Entypo from 'react-native-vector-icons/Entypo';

export default class ImageSelectModal extends Component {
    renderRow = (images) => {
        let isSelected = true;
        images.forEach((i) => !this.props.currSelected[i.image.filename] ? isSelected = false : null);

        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    {!isSelected ?
                        <Touchable
                            onPress={() => {
                                images.forEach((i) => this.props.setSelected(i, true));
                            }}
                        >
                            <Entypo
                                size={20}
                                color={'green'}
                                name={'circle-with-plus'}
                            />
                        </Touchable>
                        :
                        <Touchable
                            onPress={() => {
                                images.forEach((i) => this.props.setSelected(i, false));
                            }}
                        >
                            <Entypo
                                size={20}
                                color={'red'}
                                name={'circle-with-minus'}
                            />
                        </Touchable>
                    }
                </View>
                {
                    images.map((item) =>
                        <TouchableImage
                            key={`${item.image.filename}`}
                            item={item}
                            selected={this.props.currSelected[item.image.filename]}
                            toggleSelected={this.props.toggleSelected}
                        />
                    )
                }
            </View>
        );
    };

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log('here');
        }
    }

    render() {
        const {cameraRollRows, modalVisible, toggleModal, setCurrSelected} = this.props;

        return (
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={modalVisible}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <Touchable
                            onPress={() => {
                                toggleModal();
                                setCurrSelected([]);
                            }}
                        >
                            <EvilIcons
                                name={'close'}
                                size={30}
                            />
                        </Touchable>
                        <Text
                            onPress={toggleModal}
                            style={[
                                darkFontStyles.regular,
                                {color: 'blue'}
                            ]}
                        >
                            {'Done'}
                        </Text>
                    </View>
                    <FlatList
                        data={cameraRollRows}
                        extraData={this.props.currSelected}
                        keyExtractor={(item) => `${item[0].timestamp}`}
                        renderItem={({item}) => this.renderRow(item)}
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