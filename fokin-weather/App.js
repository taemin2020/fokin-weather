import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Loading from "./Loading"
import * as Location from 'expo-location';
import {Alert} from "react-native";
import axios from "axios";
import Weather from "./Weather";


const API_KEY = "29711bb5de98e68597aa40fd2d95124d";

export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp, temp_max, temp_min },
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp,
      temp_max,
      temp_min
    });
  };
    
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad!!");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() { 
    const { isLoading, temp, condition, temp_max, temp_min } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={temp} condition={condition} temp_max={temp_max} temp_min={temp_min}/>
    );
  }
}
