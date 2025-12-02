'use client'

import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import './ResumeUploader.css'

interface ResumeData {
    bio: string
    skills: string[]
    experience: any[]
    education: any[]
}

interface ResumeUploaderProps {
    onUploadComplete: (data: ResumeData) => void
}

export default function ResumeUploader({ onUploadComplete }: ResumeUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file')
            return
        }

        setFileName(file.name)
        setIsScanning(true)

        // Simulate upload and scanning delay
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/resume/parse', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error('Parsing failed')

            const data = await res.json()

            // Artificial delay for "scanning" effect
            setTimeout(() => {
                setIsScanning(false)
                onUploadComplete(data)
            }, 2000)

        } catch (error) {
            console.error('Upload failed', error)
            setIsScanning(false)
            alert('Failed to parse resume')
        }
    }

    return (
        <Card className={`resume-uploader ${isDragging ? 'dragging' : ''}`}>
            {isScanning ? (
                <div className="scanning-state">
                    <div className="scanner-animation">
                        <div className="scan-line"></div>
                        <div className="document-icon">📄</div>
                    </div>
                    <p className="scanning-text">AI is reading your resume...</p>
                    <p className="filename">{fileName}</p>
                </div>
            ) : (
                <div
                    className="upload-zone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="upload-icon">✨</div>
                    <h3>Magic Auto-Fill</h3>
                    <p>Drag & drop your resume (PDF) to auto-fill your profile</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf"
                        onChange={handleFileSelect}
                        hidden
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Select PDF
                    </Button>
                </div>
            )}
        </Card>
    )
}
