import { useEffect, useRef, useState } from 'react'

function useAdminCrudFeedback() {
  const [toast, setToast] = useState({
    open: false,
    type: 'success',
    message: '',
  })

  const [operation, setOperation] = useState({
    type: null,
    loading: false,
  })

  const toastTimerRef = useRef(null)

  const showToast = (type, message) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }

    setToast({
      open: true,
      type,
      message,
    })

    toastTimerRef.current = setTimeout(() => {
      setToast((current) => ({
        ...current,
        open: false,
      }))

      toastTimerRef.current = null
    }, 3800)
  }

  const closeToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }

    setToast((current) => ({
      ...current,
      open: false,
    }))
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const startOperation = (type) => {
    setOperation({
      type,
      loading: true,
    })
  }

  const finishOperation = () => {
    setOperation({
      type: null,
      loading: false,
    })
  }

  const getErrorMessage = (
    error,
    fallback = 'Something went wrong. Please try again.'
  ) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallback
    )
  }

  const handleError = (
    error,
    fallback
  ) => {
    const message = getErrorMessage(
      error,
      fallback
    )

    showToast('error', message)

    return message
  }

  return {
    toast,
    showToast,
    closeToast,
    operation,
    startOperation,
    finishOperation,
    getErrorMessage,
    handleError,
  }
}

export default useAdminCrudFeedback