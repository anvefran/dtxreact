import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import usePatients from "../utils/hooks/usePatients";
import { useForm, Controller } from "react-hook-form";
import useDebounceEffect from "../utils/hooks/useDebounceEffect";
import { TextField, Typography } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { useDispatch, useSelector } from "react-redux";
import { popDialog } from "../slices/dialogSlice";
//services
import { createAppointment, updateAppointment} from "../services/appointmentServices";

//local
import DtxTextField from "../Components/Form/DtxTextField";
import DtxSelect from "../Components/Form/DtxSelect";


const AppointmentInfo = ({ ...props }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const patients = usePatients(searchQuery);
    const [selectedPatient, setSelectedPatient] = useState("");
    const dispatch = useDispatch();

    const mode = props?.mode;
    const isEditMode = mode === "EDIT";
    const appointmentData = props?.appointmentData
    const appointmentId = appointmentData?._id;
    const doctorId = useSelector(({ user }) => user.doctorId)
    let paciente =''
    const startDate = new Date();
    if (appointmentData){
        paciente = patients.filter((patient) => patient._id===appointmentData.paciente_id)[0]
        console.log(paciente)
        const date = new Date(appointmentData.fecha_cita);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        startDate.setUTCFullYear(year);
        startDate.setUTCMonth(month);
        startDate.setUTCDate(day);
    }

    const { control, watch, reset, handleSubmit } = isEditMode?useForm({
        mode: "onChange",
        defaultValues: {
            patient:paciente,
            fecha_cita: dayjs(startDate),
            hora_inicio_cita: dayjs(appointmentData.hora_inicio_cita),
            hora_fin_cita: dayjs(appointmentData.hora_fin_cita),
            nota: appointmentData.motivo
        },
    }):useForm({
        mode: "onChange",
        defaultValues: {
            //selectedPatient,
            fecha_cita: dayjs(),
            hora_inicio_cita: dayjs('2022-04-17T15:30'),
            hora_fin_cita: dayjs('2022-04-17T16:00'),
        },
    })
    const search = watch("search");

    const handlePatienteChange = (event, value) => {
        setSelectedPatient(value);
    }

    useEffect(() => {
        if (selectedPatient) {
            reset(selectedPatient);
        }
    }, [selectedPatient, reset]);


    useDebounceEffect(
        () => {
            setSearchQuery(search);
        },
        350,
        [search]
    );
    
    // Función para manejar el envío del formulario
    const onSubmit = async (data) => {

        const appointmentDataToSend = {
            paciente_id: data["_id"],
            fecha_cita: data["fecha_cita"],
            hora_inicio_cita: data["hora_inicio_cita"],
            hora_fin_cita: data["hora_fin_cita"],
            motivo: data["nota"]
        }

        try {
            setLoading(true)
            //onProgress(true)
            if (isEditMode) {
                await updateAppointment(doctorId, appointmentId, appointmentDataToSend);
              } else {
                await createAppointment(doctorId, appointmentDataToSend)
              }
            //dispatch(incrementDataRevision({ event: "appointmentRevision" }))
            dispatch(popDialog())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
            //onProgress(false)
        }
    };

    return (<div className="appointment-container p-10">
        <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                        name="patient"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={patients}
                                key={option => option["_id"]}
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option["_id"]}>
                                            {option.nombres} {option.apellidos} - {option.cedula}
                                        </li>
                                    );
                                }}
                                getOptionLabel={option => `${option.nombres} ${option.apellidos} - ${option.cedula}`}
                                onChange={handlePatienteChange}
                                renderInput={(params) => <TextField {...params} label="Seleccione un paciente..." required/>}
                                required
                            />
                        )}
                    />
                <Typography variant="h6" fontWeight="bold" className="self-start">
                    Información paciente
                </Typography>
                <div className="flex flex-row gap-x-5">
                    <DtxTextField
                        viewMode={true}
                        control={control}
                        name={"info_general.nombres"}
                        pattern={/^[A-Za-z ]+$/g}
                        patternMessage={"Solo se aceptan letras y espacios"}
                        label="Nombres"
                    />
                    <DtxTextField
                        viewMode={true}
                        control={control}
                        name={"info_general.apellidos"}
                        pattern={/^[A-Za-z ]+$/g}
                        patternMessage={"Solo se aceptan letras y espacios"}
                        label="Apellidos"
                    />
                    <DtxTextField
                        viewMode={true}
                        control={control}
                        name={"info_general.cedula"}
                        pattern={/^\d{10}$/g}
                        patternMessage={"# Cedula invalido"}
                        label="Cédula"
                    />
                </div>
                <div className="flex  flex-row gap-x-5">
                    <DtxSelect
                        viewMode={true}
                        control={control}
                        name={"info_general.sexo"}
                        label="Sexo"
                        options={[
                            { label: "Masculino", value: "masculino" },
                            { label: "Femenino", value: "femenino" },
                            { label: "Otro", value: "otro" },
                        ]}
                    />
                    <DtxTextField
                        viewMode={true}
                        control={control}
                        name={"info_general.edad"}
                        label="Edad"
                        pattern={/^(?:1[0-4]\d|[0-9]{1,2})$|^150$/g}
                        patternMessage={"Edades válidas: 0-150 años."}
                    />
                </div>
                <div className="flex gap-x-5">
                    <DtxTextField
                        viewMode={true}
                        control={control}
                        name={"info_general.celular"}
                        label="Celular"
                        pattern={/^\d{10}$/g}
                        patternMessage={"# Celular invalido"}
                    />
                </div>
                <Typography variant="h6" fontWeight="bold" className="self-start">
                    Horario
                </Typography>
                <div className="appointment-date-container flex flex-col gap-5">
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <label htmlFor="fecha_cita">Fecha de cita:</label>
                        <Controller
                            name="fecha_cita"
                            control={control}
                            render={({ field }) => <DatePicker {...field} />}
                            required
                        />

                        <label htmlFor="hora_inicio_cita">Seleccionar Hora Inicio:</label>
                        <Controller
                            name="hora_inicio_cita"
                            control={control}
                            render={({ field }) => <TimeField {...field} />}
                            required
                        />

                        <label htmlFor="hora_fin_cita">Seleccionar Hora Fin:</label>
                        <Controller
                            name="hora_fin_cita"
                            control={control}
                            render={({ field }) => <TimeField {...field} />}
                            required
                        />

                    </LocalizationProvider>
                </div>
                <div className="appointment-footer flex flex-col gap-5">
                    Agregar Nota
                    <Controller
                        name="nota"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="outlined-multiline-flexible"
                                label="Nota"
                                multiline
                                maxRows={4}
                            />
                        )}
                    />
                    <button type="submit">Enviar</button>
                </div>
            </form>
        </div>


    </div>)
}

export default AppointmentInfo;