import os
import streamlit as st
import phonenumbers
from phonenumbers import geocoder, carrier, timezone
import folium
from streamlit_folium import st_folium
from opencage.geocoder import OpenCageGeocode


def get_coordinates(location: str):
    geocoder = OpenCageGeocode(os.getenv("MOBILE_NUMBER_TRACKER_OPENCAGE_API_KEY"))
    query = str(location)
    results= geocoder.geocode(query)[0]
    return results["geometry"]["lat"], results["geometry"]["lng"]


def render():
    st.title("📱 Phone Number Info Lookup with Map")

    phone_input = st.text_input("Enter a phone number (with country code)", "+639171234567")

    if phone_input:
        try:
            number = phonenumbers.parse(phone_input)
            
            valid = phonenumbers.is_valid_number(number)
            possible = phonenumbers.is_possible_number(number)
            location = geocoder.description_for_number(number, 'en')
            provider = carrier.name_for_number(number, 'en')
            time_zones = timezone.time_zones_for_number(number)

            st.subheader("🔍 Details")
            st.write(f"**Valid Number:** {valid}")
            st.write(f"**Possible Number:** {possible}")
            st.write(f"**Location:** {location}")
            st.write(f"**Carrier:** {provider}")
            st.write(f"**Time Zones:** {time_zones}")

            # Geocode the location
            latitude, longitude = get_coordinates(location)

            if latitude and longitude:
                st.subheader("🗺️ Location Map")
                # st.write(f"**Full Location Details:** {geo_location.address}")
                st.write(f"**Latitude:** {latitude}")
                st.write(f"**Longitude:** {longitude}")

                # Create and display map
                map_obj = folium.Map(location=[latitude, longitude], zoom_start=10)
                folium.Marker([latitude, longitude], popup=location).add_to(map_obj)
                st_folium(map_obj, width=700, height=500)
            else:
                st.warning("Could not find coordinates for the location.")
        except Exception as e:
            st.error(f"Error: {e}")
