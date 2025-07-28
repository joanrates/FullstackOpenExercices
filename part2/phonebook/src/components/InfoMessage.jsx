/**
 * @param {{ message: string, mtype: 'normal' | 'bad' }} param
 */
const InfoMessage = ({message, mtype}) => {
    const errMsgStyle = mtype === 'bad' ? {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        } : {
            color: 'green',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
        }
    if (!message) return null;
    return (
        <div style={errMsgStyle}>
            {message}
        </div>
    )    
}

export default InfoMessage