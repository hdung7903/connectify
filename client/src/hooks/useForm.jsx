import { useState } from 'react';

export default function useForm(submitFunction, initial) {
    const [values, setValues] = useState(initial || {});

    /**
     * Handle change in input element
     * @param e Event or custom object
     */
    const handleChange = (e) => {
        let name, value;

        if (e.target) {
            name = e.target.name;
            if (e.target.type === 'checkbox') {
                value = e.target.checked;
            } else if (e.target.type === 'file') {
                value = e.target.files;
            } else {
                value = e.target.value;
            }
        } else {
            name = e.name;
            value = e.value;
        }

        setValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        submitFunction();
    };

    return [values, handleChange, handleSubmit, setValues];
}
