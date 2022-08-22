import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/utils/pipe/parse-object-id.pipe';
import { ApiQueryParams } from '~decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from 'src/utils/interceptor/api-query-params.dto';
import { collectionNames } from 'src/config/collections/collectionName';
import { ProvinceService } from './province.service';
import * as path from 'path';
import { DistrictService } from '~common/c4-districts/district.service';
import { WardService } from '~common/c5-wards/ward.service';
import { FileHelper } from 'src/utils/helper/file.helper';

@ApiTags('Provinces')
@Controller(collectionNames.province.path)
export class ProvinceController {
  constructor(
    private readonly provinceService: ProvinceService,
    private readonly districtService: DistrictService,
    private wardService: WardService,
  ) {}

  /**
   * Find all
   * @param queryParams
   * @returns
   */
  @Get('')
  @HttpCode(200)
  async findAll(
    @ApiQueryParams() queryParams: ApiQueryParamsDto,
  ): Promise<any> {
    const [district, province, ward] = await Promise.all([
      this.provinceService.deleteMany({}),
      this.districtService.deleteMany({}),
      this.wardService.deleteMany(),
    ]);
    console.log({ district, province, ward });
    const jsonPath = path.join(__dirname, '../../../utils/json/dvhcvn.json');
    /* eslint no-console: 0 */
    console.log('jsonPath', jsonPath);

    const idFileExist = FileHelper.isFileExist(jsonPath);
    if (idFileExist) {
      const dataString = FileHelper.readFileSync(jsonPath).toString();
      try {
        const { data } = JSON.parse(dataString);

        const resultPromise = data.map((tinh: any) => {
          const tinhPromise = this.provinceService.create({
            name: tinh.name,
            type: tinh.type,
          });

          return tinhPromise.then((rsTinh) => {
            const idTinh = rsTinh._id;

            return tinh.level2s.map((huyen: any) => {
              const huyenPromise = this.districtService.create({
                name: huyen.name,
                type: huyen.type,
                idProvince: idTinh,
              });

              huyenPromise.then((rsHuyen) => {
                return huyen.level3s.map((xa: any) => {
                  const xaPromise = this.wardService.create({
                    name: xa.name,
                    type: xa.type,
                    idProvince: idTinh,
                    idDistrict: rsHuyen._id,
                  });

                  return xaPromise;
                });
              });
            });
          });
        });

        await Promise.all(resultPromise);

        return this.provinceService.find(queryParams);

        return { success: true };
      } catch (e) {
        /* eslint no-console: 0 */
        console.error(e);
      }
    } else {
      console.error(`${jsonPath} was not found, cannot seed province`);
    }
  }

  /**
   * Create
   * @param body
   * @returns
   */
  @Post('')
  @HttpCode(201)
  async create(@Body() body: any): Promise<any> {
    return this.provinceService.create(body);
  }

  /**
   * Update by ID
   * @param id
   * @param body
   * @returns
   */
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: any,
  ): Promise<any> {
    return this.provinceService.updateById(id, body);
  }

  /**
   * Delete by ID
   * @param id
   * @returns
   */
  @Delete(':id')
  // @HttpCode(204)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    return this.provinceService.deleteById(id);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @Get('paginate')
  @HttpCode(200)
  async paginate(@ApiQueryParams() query: ApiQueryParamsDto): Promise<any> {
    return this.provinceService.paginate(query);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @Get('count')
  @HttpCode(200)
  async count(@Query() query: any): Promise<any> {
    return this.provinceService.count(query);
  }

  /**
   * Find by id
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(200)
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    const result = await this.provinceService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}
