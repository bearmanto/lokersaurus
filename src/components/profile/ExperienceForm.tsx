'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import './ExperienceForm.css'

interface ExperienceItem {
    title: string
    company?: string
    institution?: string
    startDate: string
    endDate: string
    current: boolean
    description: string
}

interface ExperienceFormProps {
    experience: ExperienceItem[]
    onChange: (experience: ExperienceItem[]) => void
    type?: 'work' | 'education'
}

export default function ExperienceForm({ experience, onChange, type = 'work' }: ExperienceFormProps) {
    const [expanded, setExpanded] = useState<number | null>(null)

    const addItem = () => {
        const newItem: ExperienceItem = {
            title: '',
            company: type === 'work' ? '' : undefined,
            institution: type === 'education' ? '' : undefined,
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        }
        onChange([...experience, newItem])
        setExpanded(experience.length)
    }

    const removeItem = (index: number) => {
        onChange(experience.filter((_, i) => i !== index))
        if (expanded === index) setExpanded(null)
    }

    const updateItem = (index: number, field: string, value: any) => {
        const updated = [...experience]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div className="experience-form">
            {experience.map((item, index) => (
                <div key={index} className="experience-item">
                    <div className="experience-header" onClick={() => setExpanded(expanded === index ? null : index)}>
                        <div>
                            <strong>{item.title || 'Untitled'}</strong>
                            {(item.company || item.institution) && (
                                <span className="experience-org"> · {item.company || item.institution}</span>
                            )}
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(index); }} className="remove-btn">
                            Remove
                        </button>
                    </div>

                    {expanded === index && (
                        <div className="experience-body">
                            <Input
                                label={type === 'work' ? 'Job Title' : 'Degree / Field'}
                                value={item.title}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                placeholder={type === 'work' ? 'Software Engineer' : 'Bachelor of Science in Computer Science'}
                                fullWidth
                            />

                            <Input
                                label={type === 'work' ? 'Company' : 'Institution'}
                                value={type === 'work' ? item.company : item.institution}
                                onChange={(e) => updateItem(index, type === 'work' ? 'company' : 'institution', e.target.value)}
                                placeholder={type === 'work' ? 'Tech Corp' : 'University Name'}
                                fullWidth
                            />

                            <div className="form-row">
                                <Input
                                    label="Start Date"
                                    type="month"
                                    value={item.startDate}
                                    onChange={(e) => updateItem(index, 'startDate', e.target.value)}
                                    fullWidth
                                />

                                {!item.current && (
                                    <Input
                                        label="End Date"
                                        type="month"
                                        value={item.endDate}
                                        onChange={(e) => updateItem(index, 'endDate', e.target.value)}
                                        fullWidth
                                    />
                                )}
                            </div>

                            <div className="form-checkbox">
                                <input
                                    type="checkbox"
                                    id={`current-${index}`}
                                    checked={item.current}
                                    onChange={(e) => updateItem(index, 'current', e.target.checked)}
                                />
                                <label htmlFor={`current-${index}`}>I currently {type === 'work' ? 'work' : 'study'} here</label>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={item.description}
                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    placeholder="Describe your responsibilities and achievements..."
                                    className="input"
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <Button type="button" variant="secondary" onClick={addItem}>
                + Add {type === 'work' ? 'Experience' : 'Education'}
            </Button>
        </div>
    )
}
