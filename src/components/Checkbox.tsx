interface CheckboxProps {
	id?: string
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
}

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
	return (
		<label
			className="flex items-center gap-2 cursor-pointer select-none text-lg sm:text-xl text-white/80"
			htmlFor={id}
		>
			<input
				type="checkbox"
				id={id}
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
			/>
			{label}
		</label>
	)
}
