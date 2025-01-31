import { useState, useCallback } from "react"

export function useFormValidation(initialValues, validationRules) {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const validate = useCallback(
        (name, value) => {
            if (!validationRules[name]) return ""

            for (const rule of validationRules[name]) {
                if (!rule.validate(value)) {
                    return rule.message
                }
            }

            return ""
        },
        [validationRules],
    )

    const handleChange = useCallback(
        (name, value) => {
            setValues((prev) => ({ ...prev, [name]: value }))
            setTouched((prev) => ({ ...prev, [name]: true }))

            const error = validate(name, value)
            setErrors((prev) => ({ ...prev, [name]: error }))
        },
        [validate],
    )

    const validateAll = useCallback(() => {
        const newErrors = {}
        let isValid = true

        Object.keys(validationRules).forEach((name) => {
            const error = validate(name, values[name])
            if (error) {
                newErrors[name] = error
                isValid = false
            }
        })

        setErrors(newErrors)
        return isValid
    }, [validate, values, validationRules])

    return {
        values,
        errors,
        touched,
        handleChange,
        validateAll,
        setValues,
        setErrors,
    }
}

