import React from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import { useState } from 'react'
import MapsCard from '../components/MapsCard'
import BeachIcon from '../assets/img/mapIcons/beach-icon.png'
import CarRentalIcon from '../assets/img/mapIcons/car_rental-icon.png'
import DiceIcon from '../assets/img/mapIcons/dice-icon.png'
import DolphinIcon from '../assets/img/mapIcons/dolphin-icon.png'
import FerriswheelIcon from '../assets/img/mapIcons/ferriswheel-icon.png'
import PharmacyIcon from '../assets/img/mapIcons/pharmacy-icon.png'
import ShoppingBagIcon from '../assets/img/mapIcons/shoppingbag-icon.png'
import WorshipChristianIcon from '../assets/img/mapIcons/worship_christian-icon.png'

const Maps = () => {
  const [selected, setSelected] = useState({})

  const onSelect = (item) => {
    setSelected(item)
  }

  const mapStyles = {
    height: '80vh',
    width: '100%',
  }

  const defaultCenter = {
    lat: 45.2027679,
    lng: 13.6033336,
  }

  const locations = [
    {
      name: 'Aquacolors Poreč',
      location: {
        lat: 45.1991016,
        lng: 13.6029764,
      },
      description: 'https://www.aquacolors.eu/en/',
      phoneNumber: '052 219 671',
      icon: FerriswheelIcon,
    },

    {
      name: 'Dinopark Funtana',
      location: {
        lat: 45.1627666,
        lng: 13.6077202,
      },
      description: 'https://dinopark.hr/',
      phoneNumber: '052 445 327',
      icon: FerriswheelIcon,
    },

    {
      name: 'Skilift Poreč',
      location: {
        lat: 45.2053572,
        lng: 13.5904286,
      },
      description: 'https://www.skiliftporec.com/',
      phoneNumber: '091 474 7714',
      icon: FerriswheelIcon,
    },

    {
      name: 'Plava Laguna Beach',
      location: {
        lat: 45.2057328,
        lng: 13.5898102,
      },
      description:
        'https://www.beachrex.com/en/croatia/istra/porec-beaches/beach-plava-laguna',
      phoneNumber: '',
      icon: BeachIcon,
    },

    {
      name: 'Island St. Nicholas Beach',
      location: {
        lat: 45.2236198,
        lng: 13.5830423,
      },
      description: 'Sand beach, Pet friendly beach',
      phoneNumber: '',
      icon: BeachIcon,
    },

    {
      name: 'Naftaplin Beach Poreč',
      location: {
        lat: 45.223915,
        lng: 13.5910393,
      },
      description:
        'http://croatia.hr/en-GB/experiences/beaches/naftaplin-beach',
      phoneNumber: '',
      icon: BeachIcon,
    },

    {
      name: 'Euphrasian Basilica',
      location: {
        lat: 45.2261631,
        lng: 13.5924073,
      },
      description: 'http://www.zupaporec.com/euphrasian-basilica.html',
      phoneNumber: '052 451 784',
      icon: WorshipChristianIcon,
    },

    {
      name: 'Polidor Beach',
      location: {
        lat: 45.1838102,
        lng: 13.5958406,
      },
      description: 'http://croatia.hr/en-GB/experiences/beaches/polidor-beach',
      phoneNumber: '099 319 3223',
      icon: BeachIcon,
    },

    {
      name: 'Jet Ski Rentals Lanterna',
      location: {
        lat: 45.2121983,
        lng: 13.594518,
      },
      description: '',
      phoneNumber: '091 765 6053',
      icon: FerriswheelIcon,
    },

    {
      name: 'Parasail Poreč',
      location: {
        lat: 45.1961985,
        lng: 13.5632088,
      },
      description: 'http://www.parasailporec.com/',
      phoneNumber: '097 628 3388',
      icon: FerriswheelIcon,
    },

    {
      name: 'Beach Funtana',
      location: {
        lat: 45.1734153,
        lng: 13.5744696,
      },
      description: 'http://www.beachrex.com/en/beach/beach-funtana',
      phoneNumber: '',
      icon: BeachIcon,
    },

    {
      name: 'Zelena Laguna Beach',
      location: {
        lat: 45.197871,
        lng: 13.584698,
      },
      description:
        'https://www.beachrex.com/en/croatia/istra/porec-beaches/beach-zelena-laguna',
      phoneNumber: '',
      icon: BeachIcon,
    },

    {
      name: 'Parentium Beach',
      location: {
        lat: 45.2026595,
        lng: 13.587133,
      },
      description:
        'https://www.beachrex.com/en/croatia/istra/porec-beaches/beach-perentium',
      phoneNumber: '',
      icon: BeachIcon,
    },

    {
      name: 'Grand Casino Palazzo',
      location: {
        lat: 45.227359,
        lng: 13.587628,
      },
      description: 'https://grandcasino-palazzo.com/en/home-eng/',
      phoneNumber: '052 858 833',
      icon: DiceIcon,
    },

    {
      name: 'Aqarium & Terrarium Poreč',
      location: {
        lat: 45.2271085,
        lng: 13.5937997,
      },
      description: 'http://www.akvarij-porec.com.hr/',
      phoneNumber: '052 428 720',
      icon: DolphinIcon,
    },

    {
      name: 'Sixt Rent a Car',
      location: {
        lat: 45.2244513,
        lng: 13.596781,
      },
      description: 'https://www.sixt.hr/en/',
      phoneNumber: '095 438 2416',
      icon: CarRentalIcon,
    },

    {
      name: 'Diving Centre Poreč',
      location: {
        lat: 45.2154743,
        lng: 13.5961982,
      },
      description: 'https://linktr.ee/Diving_center_porec_',
      phoneNumber: '091 452 9070',
      icon: FerriswheelIcon,
    },

    {
      name: 'Pharmacy',
      location: {
        lat: 45.225994,
        lng: 13.6022777,
      },
      description: '',
      phoneNumber: '052 434 950',
      icon: PharmacyIcon,
    },

    {
      name: 'Pharmacy Salus',
      location: {
        lat: 45.2270693,
        lng: 13.6079407,
      },
      description: 'http://ljekarnaonline.hr/',
      phoneNumber: '052 443 888',
      icon: PharmacyIcon,
    },

    {
      name: 'Gallery Mall Poreč',
      location: {
        lat: 45.2261901,
        lng: 13.6135035,
      },
      description: 'https://galerijaporec.hr/',
      phoneNumber: '',
      icon: ShoppingBagIcon,
    },
  ]
  return (
    <LoadScript googleMapsApiKey="AIzaSyC45CuvGwYN5vwsDeZbf5ahyxxPFXImi5o">
      <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
        {locations.map((item) => {
          return (
            <Marker
              key={item.name}
              position={item.location}
              onClick={() => onSelect(item)}
              icon={item.icon}
            />
          )
        })}
        {selected.location && (
          <InfoWindow
            position={selected.location}
            clickable={true}
            onCloseClick={() => setSelected({})}
          >
            <MapsCard
              name={selected.name}
              description={selected.description}
              phoneNumber={selected.phoneNumber}
            />
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}

export default Maps
