import { useState, useEffect } from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const HotelRoomDialog = ({
  isDialogOpen,
  handleDialogClose,
  hotelRoom,
  hotelRoomValueFromDialog,
  dialogTitle,
}) => {
  const [currentHotelRoom, setCurrentHotelRoom] = useState(null)
  const [isNameInputValid, setIsNameInputValid] = useState(true)

  useEffect(() => {
    setCurrentHotelRoom(hotelRoom)
  }, [hotelRoom])

  function onChangeHotelRoomName(e) {
    if (e.target.value === '') {
      setIsNameInputValid(false)
      return
    }
    setIsNameInputValid(true)
    setCurrentHotelRoom({ ...currentHotelRoom, name: e.target.value })
  }

  function onChangeHotelRoomNumber(e) {
    if (e.target.value === '') {
      setIsNameInputValid(false)
      return
    }
    setIsNameInputValid(true)
    setCurrentHotelRoom({ ...currentHotelRoom, number: e.target.value })
  }

  return (
    <>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth={true}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Hotel Room Name"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={hotelRoom.name}
            error={!isNameInputValid}
            onChange={onChangeHotelRoomName}
          />
        </Box>

        <Box m="auto" sx={{ width: '70%' }} pb={3}>
          <TextField
            id="outlined-basic"
            label="Hotel Room Number"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={hotelRoom.number}
            error={!isNameInputValid}
            onChange={onChangeHotelRoomNumber}
          />
        </Box>
        <Box mx="auto" pb={3} pt={1}>
          <Button
            variant="outlined"
            onClick={() => {
              if (!isNameInputValid) {
                return
              }
              hotelRoomValueFromDialog(currentHotelRoom)
              handleDialogClose()
            }}
          >
            Save
          </Button>
        </Box>
      </Dialog>
    </>
  )
}

export default HotelRoomDialog
