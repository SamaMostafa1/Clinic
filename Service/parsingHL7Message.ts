async function parseCreateAppointmentHL7Message(message) {
    return new Promise((resolve, reject) => {

        const segments = message.split('\r');

        const parsedMessage = {};

        segments.forEach((segment, index) => {

            const fields = segment.split('|');
            const segmentName = fields[0];
            const segmentFields = {};

            // Names for each field in the MSH segment, excluding the last field
            const fieldNamesMSH = [
                'Encoding Characters', 'Sending Application', 'Sending Facility',
                'Receiving Application', 'Receiving Facility', 'Date/Time Of Message',
                'Security', 'Message Type', 'Message Control ID', 'Processing ID',
                'Version ID', 'Sequence Number', 'Continuation Pointer', 'Accept Acknowledgment Type',
                'Application Acknowledgment Type', 'Country Code', 'Character Set',
                'Principal Language Of Message', 'Alternate Character Set Handling Scheme'
            ];

            const fieldNamesARQ = [
                'Appointment ID', 'Filler Appointment ID', 'Occurrence Number', 'Placer Group Number', 'Schedule ID', 
                'Request Event Reason', 'Appointment Reason', 'Appointment Type', 'Appointment Duration', 'Appointment Duration Units',
                'Requested Start Date/Time Range', 'Priority-ARQ', 'Repeating Interval', 'Repeating Interval Duration', 
                'Placer Contact Person', 'Placer Contact Phone Number', 'Placer Contact Address', 'Placer Contact Location', 
                'Entered By Person', 'Entered By Phone Number', 'Entered By Location', 'Parent Placer Appointment ID', 
                'Parent Filler Appointment ID'
            ];

            const fileNamesAIS = [ 
                'Set ID - AIS', 'Segment Action Code', 'Universal Service ID', 'Start Date/Time', 'Start Date/Time Offset', 
                'Start Date/Time Offset Units', 'Duration', 'Duration Units', 'Allow Substitution Code', 'Filler Status Code'
            ];

            const fieldNames = segmentName === 'MSH' ? fieldNamesMSH : (segmentName === 'ARQ' ? fieldNamesARQ : fileNamesAIS);

            fields.slice(1).forEach((field, fieldIndex) => {
                segmentFields[fieldNames[fieldIndex]] = field;
            });

            parsedMessage[index + 1] = {
                segment: segmentName,
                fields: segmentFields
            };
        });

        resolve(parsedMessage);
    });
};