import streamlit as st
import pandas as pd
# import pydeck as pdk
from digipin import Digipin, LatitudeOutOfRangeError, LongitudeOutOfRangeError, InvalidDigipinCharError, InvalidDigipinError
from geopy.geocoders import Nominatim


# Initialize the digipin encoder/decoder
digipin_handler = Digipin()


def get_location_data(latitude: str, longitude: str):
    """
    Using Reverse Geocoding to find the location data
    """
    geolocator = Nominatim(user_agent="digipin_app")
    location = geolocator.reverse((latitude, longitude), exactly_one=True).raw
    return location


def render():
    st.title("📍 DIGIPIN Pro")
    st.markdown(
        "Use DIGIPIN to encode or decode locations and visualize them on a map.")

    option = st.radio("Choose an operation:", [
                      "Encode Coordinates", "Decode DIGIPIN"])

    if option == "Encode Coordinates":
        lat = st.number_input("Latitude", value=12.9716)
        lon = st.number_input("Longitude", value=77.5946)
        if st.button("Encode"):
            try:
                digipin = digipin_handler.get_digipin(lat, lon)
                st.success(f"DIGIPIN: {digipin}")
                st.map(pd.DataFrame([[lat, lon]], columns=["lat", "lon"]))
            except LatitudeOutOfRangeError as e:
                st.error(f"Error encoding: {e}")
            except LongitudeOutOfRangeError as e:
                st.error(f"Error encoding: {e}")
            except Exception as e:
                st.error(f"An unexpected error occurred during encoding: {e}")

    elif option == "Decode DIGIPIN":
        digipin = st.text_input("Enter DIGIPIN", value="4P3-JK8-52C9")
        if st.button("Decode"):
            try:
                decoded_coords2 = digipin_handler.get_lat_lng_from_digipin(
                    digipin)
                latitude = decoded_coords2.latitude
                longitude = decoded_coords2.longitude

                location_data = get_location_data(latitude=latitude, longitude=longitude)
                formatted_loc_details = f'Address: {location_data["address"]["road"]}, {location_data["address"]["neighbourhood"]}, {location_data["address"]["suburb"]}, {location_data["address"]["city_district"]}, {location_data["address"]["city"]}, {location_data["address"]["county"]}, {location_data["address"]["state_district"]}, {location_data["address"]["state"]} - {location_data["address"]["postcode"]}\n\n Country: {location_data["address"]["country"]}'
                st.success(f"Coordinates: {decoded_coords2.latitude}, {decoded_coords2.longitude} \n\n {formatted_loc_details} ",)
                st.map(pd.DataFrame([[float(decoded_coords2.latitude), float(
                    decoded_coords2.longitude)]], columns=["lat", "lon"]))
            except InvalidDigipinError as e:
                st.error(f"Error decoding: {e}")
            except InvalidDigipinCharError as e:
                st.error(f"Error decoding: {e}")
            except Exception as e:
                st.error(f"An unexpected error occurred during decoding: {e}")
