import React, {Component} from 'react';
import {View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';

import TouchableImage from './TouchableImage';

export default class CameraRollRow extends Component {
    render() {
        const {
            actions,
            images,
            selectedImages
        } = this.props;

        let isSelected = true;

        images.forEach((i) => !selectedImages[i.image.filename] ? isSelected = false : null);

        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    {!isSelected ?
                        <Touchable
                            onPress={() => actions.setSelectedRow(images, true)}
                        >
                            <Entypo
                                color={'green'}
                                name={'circle-with-plus'}
                                size={20}
                            />
                        </Touchable>
                        :
                        <Touchable
                            onPress={() => actions.setSelectedRow(images, false)}
                        >
                            <Entypo
                                color={'red'}
                                name={'circle-with-minus'}
                                size={20}
                            />
                        </Touchable>
                    }
                </View>
                {
                    images.map((item) =>
                        <TouchableImage
                            actions={actions}
                            key={`${item.image.filename}`}
                            item={item}
                            selected={selectedImages[item.image.filename]}
                        />
                    )
                }
            </View>
        );
    }
}