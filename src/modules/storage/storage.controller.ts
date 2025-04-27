import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Controller('alert')
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.storageService.create();
  }

  // @Get()
  // findRandom() {
  //   return this.alertService.findRandom();
  // }

  findAll() {
    return this.storageService.findAll();
  }

}
