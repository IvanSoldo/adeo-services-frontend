import { useState, useEffect } from 'react'
import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import { FormControlLabel } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconButton from '@mui/material/IconButton'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { loadCSS } from 'fg-loadcss'
import ServiceTypeDialog from '../components/ServiceTypeDialog'
import ServiceDialog from '../components/ServiceDialog'
import axios from 'axios'
import Collapse from '@mui/material/Collapse'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import DeleteDialog from '../components/DeleteDialog'

import CustomSnackBar from '../components/CustomSnackBar'

const AdminDashboardServices = () => {
  const [serviceType, setServiceType] = useState([])
  const [
    isEditServiceTypeDialogOpen,
    setIsEditServiceTypeDialogOpen,
  ] = useState(false)
  const [selectedServiceType, setSelectedServiceType] = useState({})
  const [
    isCreateServiceTypeDialogOpen,
    setIsCreateServiceTypeDialogOpen,
  ] = useState(false)

  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState({})
  const [isCreateServiceDialogOpen, setIsCreateServiceDialogOpen] = useState(
    false,
  )
  const [serviceTypeIndex, setServiceTypeIndex] = useState({})

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [snackbarText, setSnackbarText] = useState('')

  const [open, setOpen] = React.useState({})

  const [serviceTypeIndexDelete, setServiceTypeIndexDelete] = React.useState({})

  const [event, setEvent] = React.useState({})
  const [
    isDeleteDialogOpenServiceType,
    setIsDeleteDialogOpenServiceType,
  ] = useState(false)

  const [serviceIndexDelete, setServiceIndexDelete] = React.useState({})

  const [
    serviceTypeIndexForDelete,
    setServiceTypeIndexForDelete,
  ] = React.useState({})

  const [isDeleteDialogOpenService, setIsDeleteDialogOpenService] = useState(
    false,
  )

  React.useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.14.0/css/all.css',
      // Inject before JSS
      document.querySelector('#font-awesome-css') || document.head.firstChild,
    )

    return () => {
      node.parentNode.removeChild(node)
    }
  }, [])

  useEffect(() => {
    axios.get(`api/v1/services-type/services`).then((res) => {
      const serviceType = [...res.data.servicesTypes]
      setServiceType(serviceType)
    })
  }, [])

  const enableOrDisableService = (
    isEnabled,
    serviceTypeIndex,
    serviceIndex,
  ) => {
    let servicesState = [...serviceType]

    servicesState[serviceTypeIndex].services[serviceIndex].isEnabled = isEnabled

    let service = servicesState[serviceTypeIndex].services[serviceIndex]

    axios
      .patch(`api/v1/services/${service.id}`, {
        name: service.name,
        isEnabled: service.isEnabled,
      })
      .then((res) => {
        setServiceType(servicesState)

        let serviceState
        if (
          servicesState[serviceTypeIndex].services[serviceIndex].isEnabled ==
          true
        ) {
          serviceState = 'enabled'
        } else {
          serviceState = 'disabled'
        }

        setIsSnackbarOpen(true)
        setSnackbarText(
          servicesState[serviceTypeIndex].services[serviceIndex].name +
            ' is succesfully ' +
            serviceState,
        )
      })
  }

  const editService = (service, serviceTypeIndex) => {
    let copyServiceType = [...serviceType]
    let indexOfEditingServiceType = copyServiceType[
      serviceTypeIndex
    ].services.findIndex((st) => st.id == service.id)

    copyServiceType[serviceTypeIndex].services[indexOfEditingServiceType].name =
      service.name

    axios
      .patch(`api/v1/services/${service.id}`, {
        name: service.name,
        isEnabled: service.isEnabled,
      })
      .then((res) => {
        setIsSnackbarOpen(true)
        setSnackbarText(service.name + ' succesfully edited')
        setServiceType(copyServiceType)
      })
  }

  const deleteService = (serviceTypeIndex, serviceIndex) => {
    let servicesState = [...serviceType]

    let service = servicesState[serviceTypeIndex].services[serviceIndex]

    servicesState[serviceTypeIndex].services.splice(serviceIndex, 1)

    axios.delete(`api/v1/services/${service.id}`).then((res) => {
      setServiceType(servicesState)
      setIsSnackbarOpen(true)
      setSnackbarText('Service succesfully deleted')
    })
  }

  const createService = (serviceObject, serviceTypeIndex) => {
    var serviceTypeCopy = [...serviceType]

    axios
      .post(`api/v1/services/`, {
        name: serviceObject.name,
        isEnabled: true,
        serviceTypeId: serviceTypeCopy[serviceTypeIndex].id,
      })
      .then((res) => {
        serviceObject.id = res.data.id
        serviceObject.isEnabled = true

        serviceTypeCopy[serviceTypeIndex].services.push(serviceObject)
        setServiceType(serviceTypeCopy)
        setIsSnackbarOpen(true)
        setSnackbarText('Service succesfully created')
      })
  }

  const editServiceType = (serviceTypeObject) => {
    let copyServiceType = [...serviceType]
    let indexOfEditingServiceType = copyServiceType.findIndex(
      (st) => st.id == serviceTypeObject.id,
    )
    copyServiceType[indexOfEditingServiceType].nameEn = serviceTypeObject.nameEn
    copyServiceType[indexOfEditingServiceType].nameHr = serviceTypeObject.nameHr
    copyServiceType[indexOfEditingServiceType].nameDe = serviceTypeObject.nameDe
    copyServiceType[indexOfEditingServiceType].nameIt = serviceTypeObject.nameIt

    axios
      .patch(`api/v1/services-type/${serviceTypeObject.id}`, {
        nameEn: serviceTypeObject.nameEn,
        nameHr: serviceTypeObject.nameHr,
        nameDe: serviceTypeObject.nameDe,
        nameIt: serviceTypeObject.nameIt,
      })
      .then((res) => {
        setServiceType(copyServiceType)
        setIsSnackbarOpen(true)
        setSnackbarText(serviceTypeObject.nameEn + ' succesfully edited')
      })
  }

  const deleteServiceType = (serviceTypeIndex, e) => {
    e.stopPropagation()
    let servicesState = [...serviceType]

    let serviceTypeObject = servicesState[serviceTypeIndex]

    servicesState.splice(serviceTypeIndex, 1)

    axios.delete(`api/v1/services-type/${serviceTypeObject.id}`).then((res) => {
      setServiceType(servicesState)
      setIsSnackbarOpen(true)
      setSnackbarText('Service Type succesfully deleted')
    })
  }

  const createServiceType = (serviceTypeObject) => {
    serviceTypeObject.services = []

    axios
      .post(`api/v1/services-type`, {
        nameEn: serviceTypeObject.nameEn,
        nameHr: serviceTypeObject.nameHr,
        nameDe: serviceTypeObject.nameDe,
        nameIt: serviceTypeObject.nameIt,
      })
      .then((res) => {
        serviceTypeObject.id = res.data.id
        setServiceType([...serviceType, serviceTypeObject])
        setIsSnackbarOpen(true)
        setSnackbarText(serviceTypeObject.nameEn + ' succesfully created')
      })
  }

  const handleServiceTypeEditDialogOpen = (serviceType, e) => {
    e.stopPropagation()
    setSelectedServiceType(serviceType)
    setIsEditServiceTypeDialogOpen(true)
  }

  const handleEditServiceTypeDialogClose = () => {
    setIsEditServiceTypeDialogOpen(false)
  }

  const handleCreateServiceTypeDialogOpen = () => {
    setIsCreateServiceTypeDialogOpen(true)
  }

  const handleCreateServiceTypeDialogClose = () => {
    setIsCreateServiceTypeDialogOpen(false)
  }

  const handleServiceEditDialogOpen = (service, e, serviceTypeIndexFromRow) => {
    e.stopPropagation()
    setSelectedService(service)
    setIsEditServiceDialogOpen(true)
    setServiceTypeIndex(serviceTypeIndexFromRow)
  }

  const handleEditServiceDialogClose = () => {
    setIsEditServiceDialogOpen(false)
  }

  const handleCreateServiceDialogOpen = (serviceTypeIndexFromRow) => {
    setIsCreateServiceDialogOpen(true)
    setServiceTypeIndex(serviceTypeIndexFromRow)
  }

  const handleCreateServiceDialogClose = () => {
    setIsCreateServiceDialogOpen(false)
  }

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false)
  }

  const handleDeleteDialogCloseServiceType = () => {
    setIsDeleteDialogOpenServiceType(false)
  }

  const handleDeleteDialogOpenServiceType = (serviceTypeIndex, event) => {
    setServiceTypeIndexDelete(serviceTypeIndex)
    setEvent(event)
    setIsDeleteDialogOpenServiceType(true)
  }

  const handleDeleteDialogCloseAndDeleteServiceType = () => {
    deleteServiceType(serviceTypeIndexDelete, event)
    setIsDeleteDialogOpenServiceType(false)
  }

  const handleDeleteDialogCloseService = () => {
    setIsDeleteDialogOpenService(false)
  }

  const handleDeleteDialogOpenService = (serviceTypeIndex, serviceIndex) => {
    setServiceTypeIndexForDelete(serviceTypeIndex)
    setServiceIndexDelete(serviceIndex)
    setIsDeleteDialogOpenService(true)
  }

  const handleDeleteDialogCloseAndDeleteService = () => {
    deleteService(serviceTypeIndexForDelete, serviceIndexDelete)
    setIsDeleteDialogOpenService(false)
  }

  function Row(props) {
    const { row, serviceTypeIndex } = props

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() =>
                setOpen((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
              }
            >
              {open[row.id] ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" align="center">
            {row.id}
          </TableCell>
          <TableCell align="center">{row.nameEn}</TableCell>
          <TableCell align="center">
            <IconButton
              color="primary"
              onClick={(event) => handleServiceTypeEditDialogOpen(row, event)}
            >
              <EditOutlinedIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={(event) =>
                handleDeleteDialogOpenServiceType(serviceTypeIndex, event)
              }
            >
              <DeleteForeverOutlinedIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open[row.id]} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Button
                  color="primary"
                  size="small"
                  onClick={() =>
                    handleCreateServiceDialogOpen(serviceTypeIndex)
                  }
                >
                  Create New
                </Button>
                <Table aria-label="services">
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">
                        Is Service In Function
                      </TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.services.map((service, serviceIndex) => (
                      <TableRow key={service.id}>
                        <TableCell component="th" scope="row">
                          {service.id}
                        </TableCell>
                        <TableCell align="center">{service.name}</TableCell>
                        <TableCell align="center">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={service.isEnabled}
                                name="checkedC"
                                onClick={(e) =>
                                  enableOrDisableService(
                                    e.target.checked,
                                    serviceTypeIndex,
                                    serviceIndex,
                                  )
                                }
                              />
                            }
                            label=""
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={(event) =>
                              handleServiceEditDialogOpen(
                                service,
                                event,
                                serviceTypeIndex,
                              )
                            }
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDeleteDialogOpenService(
                                serviceTypeIndex,
                                serviceIndex,
                              )
                            }
                          >
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  return (
    <div>
      <Box sx={{ mb: 2, mt: 2 }}>
        <Button
          color="primary"
          onClick={() => handleCreateServiceTypeDialogOpen()}
        >
          Create New
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">Service Type Id</TableCell>
              <TableCell align="center">Service Type Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceType.map((type, serviceTypeIndex) => (
              <Row
                key={type.id}
                row={type}
                serviceTypeIndex={serviceTypeIndex}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ServiceTypeDialog
        isDialogOpen={isEditServiceTypeDialogOpen}
        handleDialogClose={handleEditServiceTypeDialogClose}
        serviceType={selectedServiceType}
        serviceTypeValueFromDialog={editServiceType}
        dialogTitle={`Edit: ${selectedServiceType.nameEn}`}
        dialogLabel={'Service Type'}
      />
      <ServiceTypeDialog
        isDialogOpen={isCreateServiceTypeDialogOpen}
        handleDialogClose={handleCreateServiceTypeDialogClose}
        serviceTypeValueFromDialog={createServiceType}
        serviceType={{}}
        dialogTitle={'Create new Service Type:'}
        dialogLabel={'Service Type'}
      />
      <ServiceDialog
        isDialogOpen={isEditServiceDialogOpen}
        handleDialogClose={handleEditServiceDialogClose}
        service={selectedService}
        serviceValueFromDialog={editService}
        dialogTitle={`Edit: ${selectedService}`}
        serviceTypeIndex={serviceTypeIndex}
      />
      <ServiceDialog
        isDialogOpen={isCreateServiceDialogOpen}
        handleDialogClose={handleCreateServiceDialogClose}
        serviceValueFromDialog={createService}
        service={{}}
        dialogTitle={'Create new Service :'}
        serviceTypeIndex={serviceTypeIndex}
      />
      <CustomSnackBar
        showSnackBar={isSnackbarOpen}
        message={snackbarText}
        severity={'info'}
        onClick={handleSnackbarClose}
      />
      <DeleteDialog
        isDialogOpen={isDeleteDialogOpenServiceType}
        deleteMethod={handleDeleteDialogCloseAndDeleteServiceType}
        closeDialog={handleDeleteDialogCloseServiceType}
      />
      <DeleteDialog
        isDialogOpen={isDeleteDialogOpenService}
        deleteMethod={handleDeleteDialogCloseAndDeleteService}
        closeDialog={handleDeleteDialogCloseService}
      />
    </div>
  )
}

export default AdminDashboardServices
