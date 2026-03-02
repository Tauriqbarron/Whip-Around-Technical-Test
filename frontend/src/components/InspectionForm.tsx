/**
 * =================================================================
 * INSPECTION FORM — components/InspectionForm.tsx
 * =================================================================
 *
 * Form to create a new inspection via POST /inspections.
 *
 * =================================================================
 * PROPS: InspectionFormProps
 * =================================================================
 *   cars: Car[]
 *     — list of cars to populate the dropdown selector
 *   onInspectionCreated: (inspection: Inspection) => void
 *     — callback invoked after successful creation so the parent
 *       can refresh the inspection list
 *
 * =================================================================
 * STATE
 * =================================================================
 *   carId:       string   (default: "")  — stored as string for <select> control
 *   wipers:      boolean  (default: false)
 *   engineSound: boolean  (default: false)
 *   headlights:  boolean  (default: false)
 *   errors:      string[] (default: [])
 *   loading:     boolean  (default: false)
 *
 * =================================================================
 * COMPONENT: InspectionForm({ cars, onInspectionCreated }: InspectionFormProps)
 * =================================================================
 * Renders a form with a car dropdown, three checkboxes, and a submit button.
 *
 * Form fields:
 *   - Car: <select> dropdown
 *     - Default option: "Select a car..." (value="", disabled)
 *     - One <option> per car: value={car.id}, label={car.name} ({car.make} {car.model})
 *   - Wipers:      <input type="checkbox">
 *   - Engine Sound: <input type="checkbox">
 *   - Headlights:  <input type="checkbox">
 *
 * =================================================================
 * FUNCTION: handleSubmit(e: FormEvent)
 * =================================================================
 * Called on form submission.
 *
 * - e.preventDefault()
 * - Clear previous errors
 * - Set loading to true
 * - Call createInspection({
 *     carId: parseInt(carId),
 *     wipers,
 *     engineSound,
 *     headlights
 *   })
 * - On success:
 *   - Call onInspectionCreated(createdInspection)
 *   - Reset form: carId to "", all checkboxes to false
 * - On error (catch):
 *   - If error has 'details' array, set errors to that array
 *   - If error has 'error' string, set errors to [error.error]
 * - Set loading to false in a finally block
 *
 * =================================================================
 * EDGE CASE
 * =================================================================
 * If cars array is empty, show a message instead of the form:
 *   "Add a car first before creating an inspection."
 *
 * =================================================================
 * ERROR DISPLAY
 * =================================================================
 * Same pattern as CarForm — show errors in a red container above the form.
 *
 * =================================================================
 * FORM STYLING (Tailwind)
 * =================================================================
 *   - Same card styling as CarForm (bg-white, rounded-lg, shadow, p-6)
 *   - Select: same input styling as CarForm text inputs
 *   - Checkboxes: inline with label, use flex items-center gap-2
 *     Checkbox group: flex gap-6
 *   - Submit button: same as CarForm
 *
 * =================================================================
 */
