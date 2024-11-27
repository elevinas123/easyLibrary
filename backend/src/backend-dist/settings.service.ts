import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {CreateSettingsDto, UpdateSettingsDto} from './settings.dto';
import {SettingsType} from './settings.schema';

@Injectable()
export class SettingsService {
  constructor(@InjectModel('Settings') private settingsModel:
                  Model<SettingsType>) {}

  // Get all settings
  async getAllSettings(): Promise<SettingsType[]> {
    return await this.settingsModel.find().lean().exec();
  }

  // Get settings by ID
  async getSettingsById(id: string): Promise<SettingsType> {
    const settings = await this.settingsModel.findById(id).lean().exec();
    if (!settings) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }
    return settings;
  }

  // Get settings by User ID
  async getSettingsByUserId(userId: string): Promise<SettingsType> {
    const settings = await this.settingsModel.findOne({userId}).lean().exec();
    if (!settings) {
      throw new NotFoundException(`Settings with user ID ${userId} not found`);
    }
    return settings;
  }

  // Create new settings
  async createSettings(createSettingsDto: CreateSettingsDto):
      Promise<SettingsType> {
    const newSettings = await new this.settingsModel(createSettingsDto).save();
    const savedSettings =
        await this.settingsModel.findById(newSettings._id).lean().exec();

    if (!savedSettings) {
      throw new NotFoundException(`Failed to create settings`);
    }

    return savedSettings;
  }

  // Update settings for a User
  async updateSettingsForUser(
      userId: string,
      updateSettingsDto: UpdateSettingsDto): Promise<SettingsType> {
    const settings =
        await this.settingsModel
            .findOneAndUpdate(
                {userId}, updateSettingsDto, {new: true, lean: true})
            .exec();

    if (!settings) {
      throw new NotFoundException(`Settings with user ID ${userId} not found`);
    }

    return settings;
  }

  // Update settings by ID
  async updateSettings(id: string, updateSettingsDto: UpdateSettingsDto):
      Promise<SettingsType> {
    const settings =
        await this.settingsModel
            .findByIdAndUpdate(id, updateSettingsDto, {new: true, lean: true})
            .exec();

    if (!settings) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }

    return settings;
  }
}
