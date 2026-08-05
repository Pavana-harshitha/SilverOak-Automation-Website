const processMappings = {
    Claims: {
        "Medical Claim": {
            processName: "Medical Claim Processing",
            processCode: "CLM_MED",
        },
        "Vehicle Claim": {
            processName: "Vehicle Claim Processing",
            processCode: "CLM_VEH",
        },
        "Property Claim": {
            processName: "Property Claim Processing",
            processCode: "CLM_PROP",
        },
        "Travel Claim": {
            processName: "Travel Claim Processing",
            processCode: "CLM_TRAVEL",
        },
    },

    Forms: {
        "KYC Form": {
            processName: "KYC Form Processing",
            processCode: "FORM_KYC",
        },
        "Application Form": {
            processName: "Application Form Processing",
            processCode: "FORM_APP",
        },
        "Nomination Form": {
            processName: "Nomination Form Processing",
            processCode: "FORM_NOM",
        },
        "Autopayment Form": {
            processName: "Autopayment Form Processing",
            processCode: "FORM_AUTO",
        },
    },

    Declarations: {
        "Income Declaration": {
            processName: "Income Declaration Processing",
            processCode: "DEC_INCOME",
        },
        "Health Declaration": {
            processName: "Health Declaration Processing",
            processCode: "DEC_HEALTH",
        },
        "Address Declaration": {
            processName: "Address Declaration Processing",
            processCode: "DEC_ADDRESS",
        },
        "Tax Declaration": {
            processName: "Tax Declaration Processing",
            processCode: "DEC_TAX",
        },
    },
};

export default processMappings;