import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'

export default function NavbarView({styles,totalTask,totalFreeHr,totalStudyHr,onTodayDate,onSettingsPress,headerText}) {

  return (
    <View style={styles.header}>
    <View style={styles.headerTextContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Text style={{ ...styles.headerText, color: 'rgba(255,48,51,1)', paddingBottom: 5,marginRight: 10 }}>{headerText}</Text>
        {
         totalTask.map((item, index) => {
            return (
              <View style={{ backgroundColor: 'black', height: 6, width: 6, borderRadius: 3, marginHorizontal: 3, marginTop: -5 }}></View>
            )
          })
        }
      </View>
      <Text style={{ fontSize: 12, color: 'gray' }}>{totalStudyHr | 0} study hrs, {totalFreeHr | 0} free hrs</Text>
    </View>
    <View style={{ ...styles.headerTextContainer, flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 10 }} onPress={() => onTodayDate()}>
        <Text style={{ fontSize: 12, color: 'gray' }}>Today</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ paddingHorizontal: 10, marginLeft: 10 }} onPress={() => onSettingsPress()}>
        <Image source={require('../calenderView/setting.png')} style={{ height: 22, width: 22 }} resizeMode='contain'></Image>
      </TouchableOpacity>
    </View>

  </View>
  )
}
