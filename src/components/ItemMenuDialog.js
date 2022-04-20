import { useState, useEffect } from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const ItemMenuDialog = ({
  isDialogOpen,
  handleDialogClose,
  itemMenu,
  itemMenuValueFromDialog,
  dialogTitle,
  itemMenuTypeIndex,
}) => {
  const [currentItemMenu, setCurrentItemMenu] = useState(null)
  const [isNameInputValid, setIsNameInputValid] = useState(true)

  useEffect(() => {
    setCurrentItemMenu(itemMenu)
  }, [itemMenu])

  function onChangeItemMenuNameEn(e) {
    if (e.target.value === '') {
      setIsNameInputValid(false)
      return
    }
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, nameEn: e.target.value })
  }
  function onChangeItemMenuNameHr(e) {
    if (e.target.value === '') {
      setIsNameInputValid(false)
      return
    }
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, nameHr: e.target.value })
  }
  function onChangeItemMenuNameDe(e) {
    if (e.target.value === '') {
      setIsNameInputValid(false)
      return
    }
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, nameDe: e.target.value })
  }
  function onChangeItemMenuNameIt(e) {
    if (e.target.value === '') {
      setIsNameInputValid(false)
      return
    }
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, nameIt: e.target.value })
  }
  function onChangeItemMenuDescriptionDe(e) {
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, descriptionDe: e.target.value })
  }
  function onChangeItemMenuDescriptionEn(e) {
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, descriptionEn: e.target.value })
  }
  function onChangeItemMenuDescriptionHr(e) {
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, descriptionHr: e.target.value })
  }
  function onChangeItemMenuDescriptionIt(e) {
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, descriptionIt: e.target.value })
  }
  function onChangeItemMenuNormative(e) {
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, normative: e.target.value })
  }
  function onChangeItemMenuPrice(e) {
    if (e.target.value === '') {
      setIsNameInputValid(false)
      return
    }
    setIsNameInputValid(true)
    setCurrentItemMenu({ ...currentItemMenu, price: e.target.value })
  }

  return (
    <>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth={true}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Menu Item English Name"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.nameEn}
            error={!isNameInputValid}
            onChange={onChangeItemMenuNameEn}
          />
        </Box>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Menu Item Croatian Name"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.nameHr}
            error={!isNameInputValid}
            onChange={onChangeItemMenuNameHr}
          />
        </Box>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Menu Item German Name"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.nameDe}
            error={!isNameInputValid}
            onChange={onChangeItemMenuNameDe}
          />
        </Box>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Menu Item Italian Name"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.nameIt}
            error={!isNameInputValid}
            onChange={onChangeItemMenuNameIt}
          />
        </Box>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Menu Item English Description"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.descriptionEn}
            onChange={onChangeItemMenuDescriptionEn}
          />
        </Box>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Menu Item Croatian Description"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.descriptionHr}
            onChange={onChangeItemMenuDescriptionHr}
          />
        </Box>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Menu Item Germany Description"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.descriptionDe}
            onChange={onChangeItemMenuDescriptionDe}
          />
        </Box>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Menu Item Italian Description"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.descriptionIt}
            onChange={onChangeItemMenuDescriptionIt}
          />
        </Box>

        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Normative"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.normative}
            error={!isNameInputValid}
            onChange={onChangeItemMenuNormative}
          />
        </Box>
        <Box m="auto" sx={{ width: '70%' }}>
          <TextField
            id="outlined-basic"
            label="Price in kn"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={itemMenu.price}
            error={!isNameInputValid}
            onChange={onChangeItemMenuPrice}
          />
        </Box>
        <Box mx="auto" pb={3} pt={3}>
          <Button
            variant="outlined"
            onClick={() => {
              if (!isNameInputValid) {
                return
              }
              itemMenuValueFromDialog(currentItemMenu, itemMenuTypeIndex)
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

export default ItemMenuDialog
