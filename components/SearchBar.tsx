import {StyleSheet, View, Text, Image} from  'react-native';

import React from 'react';
import { icons } from '../constants/icons';


const SearchBar = () => {

  return (

    <View className='flex-row items-center bg-dark-200 rounded-fully px-5 py-4'>
      <Image source = {icons.search} class-Name="size-5"
      resizeMode="contain" tintColor="#ab8bff"/>
    </View>

  )
}

export default SearchBar
