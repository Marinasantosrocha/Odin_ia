'use client'
import React from 'react'
import { Box } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import CustomTextField from '../../theme-elements/CustomTextField'
import countryData from './countrydata'

const countryToFlag = (isoCode: string) =>
  typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode

const CountrySelectAutocomplete = () => {
  return (
    <Autocomplete
      id='country-select-demo'
      fullWidth
      options={countryData}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props
        return (
          <Box
            key={key}
            component='li'
            sx={{ fontSize: 15, '& > span': { mr: '10px', fontSize: 18 } }}
            {...optionProps}>
            <span>{countryToFlag(option.code)}</span>
            {option.label} ({option.code}) +{option.phone}
          </Box>
        )
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          placeholder='Choose a country'
          aria-label='Choose a country'
          autoComplete='off'
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}

export default CountrySelectAutocomplete
