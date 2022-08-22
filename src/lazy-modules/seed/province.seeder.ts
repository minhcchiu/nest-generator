import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Seeder } from 'nestjs-seeder';
import * as path from 'path';
import { FileHelper } from 'src/utils/helper/file.helper';
import { Province } from '~common/c3-provinces/schemas/province.schema';
import { District } from '~common/c4-districts/schemas/district.schema';
import { Ward } from '~common/c5-wards/schemas/ward.schema';

@Injectable()
export default class ProvinceSeeder implements Seeder {
  constructor(
    @InjectModel(Province.name) private readonly modelProvince: Model<Province>,
    @InjectModel(District.name) private readonly modelDistrict: Model<District>,
    @InjectModel(Ward.name) private readonly modelWard: Model<Ward>,
  ) { }

  async seed(): Promise<any> {
    const [district, province, ward] = await Promise.all([this.modelDistrict.deleteMany({}), this.modelProvince.deleteMany({}), this.modelWard.deleteMany()])

    const jsonPath = path.join(__dirname, '../../utils/json/dvhcvn.json');
    /* eslint no-console: 0 */
    console.log('jsonPath', jsonPath);
    if (FileHelper.isFileExist(jsonPath)) {
      const dataString = FileHelper.readFileSync(jsonPath).toString();
      try {
        const { data } = JSON.parse(dataString);

        for (let index = 0; index < data.length; index++) {
          const province = await this.modelProvince.create({ name: data[index].name, type: data[index].type })
          console.log({ province })
          const level2s = data[index].level2s

          for (let l2 = 0; l2 < level2s.length; l2++) {
            const district = await this.modelDistrict.create({ idProvince: province._id, name: level2s[l2].name, type: level2s[l2].type })
            console.log({ district })
            const level3s = level2s[l2].level3s
            for (let l3 = 0; l3 < level3s.length; l3++) {
              await this.modelWard.create({
                idDistrict: district._id,
                idProvince: province._id,
                name: level3s[l3].name,
                type: level3s[l3].type,
              })

            }
          }

        }
      } catch (e) {
        /* eslint no-console: 0 */
        console.error(e);
      }
    } else {
      console.error(`${jsonPath} was not found, cannot seed province`);
    }

  }

  async drop(): Promise<any> {
    return this.modelProvince.deleteMany({});
  }
}
