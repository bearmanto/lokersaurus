'use client'

import { useState } from 'react'
import './SkillsInput.css'

interface SkillsInputProps {
    skills: string[]
    onChange: (skills: string[]) => void
}

export default function SkillsInput({ skills, onChange }: SkillsInputProps) {
    const [input, setInput] = useState('')

    const addSkill = (skill: string) => {
        const trimmed = skill.trim()
        if (trimmed && !skills.includes(trimmed)) {
            onChange([...skills, trimmed])
            setInput('')
        }
    }

    const removeSkill = (index: number) => {
        onChange(skills.filter((_, i) => i !== index))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addSkill(input)
        } else if (e.key === 'Backspace' && !input && skills.length > 0) {
            removeSkill(skills.length - 1)
        }
    }

    return (
        <div className="skills-input">
            <div className="skills-list">
                {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="skill-remove"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={skills.length === 0 ? "Type a skill and press Enter..." : "Add another..."}
                    className="skill-input"
                />
            </div>
            <p className="skills-hint">Press Enter to add skills. Common: JavaScript, React, Python, SQL, etc.</p>
        </div>
    )
}
