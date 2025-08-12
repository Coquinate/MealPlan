'use client'

import React, { useState } from 'react'
import { Button, Input, Select, Card } from '@coquinate/ui'
import { useTranslation } from '@coquinate/i18n'
import { cn } from '@coquinate/ui'

export interface UserProfileData {
  id: string
  email: string
  household_size: number
  menu_type: 'vegetarian' | 'omnivore'
  subscription_status: string
  has_active_trial: boolean
  has_trial_gift_access: boolean
  stripe_customer_id?: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export interface UserProfileUpdateData {
  household_size?: number
  menu_type?: 'vegetarian' | 'omnivore'
  default_view_preference?: 'week' | 'today'
}

export interface UserProfileProps {
  profile: UserProfileData
  onUpdate: (data: UserProfileUpdateData) => Promise<void>
  onChangePassword: () => void
  onDeleteAccount: () => void
  loading?: boolean
  updateLoading?: boolean
  error?: string
  success?: string
  className?: string
}

/**
 * User profile management component
 * Allows users to update household preferences and manage account
 */
export const UserProfile = React.forwardRef<HTMLDivElement, UserProfileProps>(
  ({ 
    profile,
    onUpdate,
    onChangePassword,
    onDeleteAccount,
    loading = false,
    updateLoading = false,
    error,
    success,
    className 
  }, ref) => {
    const { t } = useTranslation('auth')
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<UserProfileUpdateData>({
      household_size: profile.household_size,
      menu_type: profile.menu_type,
      default_view_preference: 'week'
    })
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    // Household size options (1-6 members)
    const householdOptions = Array.from({ length: 6 }, (_, i) => ({
      value: (i + 1).toString(),
      label: i === 0 ? '1 persoană' : `${i + 1} persoane`
    }))

    // Menu type options
    const menuTypeOptions = [
      { value: 'omnivore', label: 'Omnivore (incluzând carne)' },
      { value: 'vegetarian', label: 'Vegetarian (fără carne)' }
    ]

    const subscriptionStatusLabels: Record<string, string> = {
      'none': 'Fără abonament',
      'trial': 'Perioada de probă',
      'active': 'Abonament activ',
      'expired': 'Abonament expirat',
      'cancelled': 'Abonament anulat'
    }

    const validateForm = () => {
      const errors: Record<string, string> = {}
      
      if (!formData.household_size || formData.household_size < 1 || formData.household_size > 6) {
        errors.household_size = 'Mărimea gospodăriei trebuie să fie între 1 și 6'
      }
      
      if (!formData.menu_type || !['vegetarian', 'omnivore'].includes(formData.menu_type)) {
        errors.menu_type = 'Tipul meniului este obligatoriu'
      }
      
      setFieldErrors(errors)
      return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!validateForm()) {
        return
      }
      
      try {
        await onUpdate(formData)
        setIsEditing(false)
      } catch (error) {
        console.error('Profile update error:', error)
      }
    }

    const handleCancel = () => {
      setFormData({
        household_size: profile.household_size,
        menu_type: profile.menu_type,
        default_view_preference: 'week'
      })
      setFieldErrors({})
      setIsEditing(false)
    }

    const handleSelectChange = (field: keyof UserProfileUpdateData) => 
      (value: string) => {
        const parsedValue = field === 'household_size' ? parseInt(value, 10) : value
        setFormData(prev => ({ ...prev, [field]: parsedValue }))
        // Clear field error when user selects
        if (fieldErrors[field]) {
          setFieldErrors(prev => ({ ...prev, [field]: '' }))
        }
      }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return (
      <Card ref={ref} className={cn('w-full max-w-2xl mx-auto p-space-lg', className)}>
        <div className="space-y-space-lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">
                Profilul meu
              </h1>
              <p className="text-sm text-text-secondary">
                Gestionați informațiile contului și preferințele
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                variant="secondary"
              >
                Editează
              </Button>
            )}
          </div>

          {/* Success message */}
          {success && (
            <div className="bg-success-50 border border-success-200 rounded-md p-space-sm">
              <p className="text-sm text-success-600">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-md p-space-sm">
              <p className="text-sm text-error-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-space-lg">
            {/* Account Information */}
            <div className="space-y-space-md">
              <h2 className="text-lg font-semibold text-text border-b border-border pb-space-xs">
                Informații cont
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div>
                  <label className="text-sm font-medium text-text">Email</label>
                  <p className="text-sm text-text-secondary mt-1">{profile.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-text">Status abonament</label>
                  <p className="text-sm text-text-secondary mt-1">
                    {subscriptionStatusLabels[profile.subscription_status] || profile.subscription_status}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-text">Cont creat la</label>
                  <p className="text-sm text-text-secondary mt-1">{formatDate(profile.created_at)}</p>
                </div>
                
                {profile.trial_ends_at && (
                  <div>
                    <label className="text-sm font-medium text-text">Perioada de probă expiră</label>
                    <p className="text-sm text-text-secondary mt-1">{formatDate(profile.trial_ends_at)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Household Preferences */}
            <div className="space-y-space-md">
              <h2 className="text-lg font-semibold text-text border-b border-border pb-space-xs">
                Preferințe gospodărie
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Household Size */}
                <div className="space-y-space-xs">
                  <label className="text-sm font-medium text-text">
                    Mărimea gospodăriei
                  </label>
                  {isEditing ? (
                    <Select
                      options={householdOptions}
                      value={formData.household_size?.toString() || ''}
                      onChange={handleSelectChange('household_size')}
                      disabled={updateLoading}
                      placeholder="Selectează mărimea gospodăriei"
                    />
                  ) : (
                    <p className="text-sm text-text-secondary mt-1">
                      {profile.household_size === 1 ? '1 persoană' : `${profile.household_size} persoane`}
                    </p>
                  )}
                  {fieldErrors.household_size && (
                    <p className="text-sm text-error">{fieldErrors.household_size}</p>
                  )}
                </div>

                {/* Menu Type */}
                <div className="space-y-space-xs">
                  <label className="text-sm font-medium text-text">
                    Tipul de meniu
                  </label>
                  {isEditing ? (
                    <Select
                      options={menuTypeOptions}
                      value={formData.menu_type || ''}
                      onChange={handleSelectChange('menu_type')}
                      disabled={updateLoading}
                      placeholder="Selectează tipul de meniu"
                    />
                  ) : (
                    <p className="text-sm text-text-secondary mt-1">
                      {profile.menu_type === 'vegetarian' ? 'Vegetarian' : 'Omnivore'}
                    </p>
                  )}
                  {fieldErrors.menu_type && (
                    <p className="text-sm text-error">{fieldErrors.menu_type}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-space-sm pt-space-md border-t border-border">
              {isEditing ? (
                <>
                  <Button
                    type="submit"
                    loading={updateLoading}
                    disabled={updateLoading}
                    className="sm:order-2"
                  >
                    Salvează modificările
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    disabled={updateLoading}
                    variant="secondary"
                    className="sm:order-1"
                  >
                    Anulează
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={onChangePassword}
                    disabled={loading}
                    variant="secondary"
                  >
                    Schimbă parola
                  </Button>
                  <Button
                    type="button"
                    onClick={onDeleteAccount}
                    disabled={loading}
                    variant="ghost"
                    className="text-error hover:bg-error-50 hover:text-error-600 sm:ml-auto"
                  >
                    Șterge contul
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </Card>
    )
  }
)

UserProfile.displayName = 'UserProfile'