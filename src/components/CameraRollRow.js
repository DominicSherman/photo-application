import React, {Component} from 'react';
import {View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';
import TouchableImage from './TouchableImage';

export default class CameraRollRow extends Component {
    render() {
        const {
            currSelected,
            images,
            setSelected,
            toggleSelected
        } = this.props;

        let isSelected = true;
        images.forEach((i) => !currSelected[i.image.filename] ? isSelected = false : null);

        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    {!isSelected ?
                        <Touchable
                            onPress={() => images.forEach((i) => setSelected(i, true))}
                        >
                            <Entypo
                                size={20}
                                color={'green'}
                                name={'circle-with-plus'}
                            />
                        </Touchable>
                        :
                        <Touchable
                            onPress={() => images.forEach((i) => setSelected(i, false))}
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
                            selected={currSelected[item.image.filename]}
                            toggleSelected={toggleSelected}
                        />
                    )
                }
            </View>
        );
    }
}